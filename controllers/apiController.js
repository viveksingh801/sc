/** @module apiController */

var jwt = require("jsonwebtoken")
const jsonpatch = require("jsonpatch")
var fs = require("fs")
const http = require("http")
const https = require("https")
const URL = require("url")
const sharp = require("sharp")
const path = require("path")

const SIZE = 50 // Default size for the image resize

module.exports = {
	/** Generates JWT Token for the user signing using APP_KEY */
	login: (req, res) => {
		if (!req.body.username) {
			res.status(400).json({
				"message": "Username missing"
			})
			return
		}
		if (!req.body.password) {
			res.status(400).json({
				"message": "Password missing"
			})
			return
		}

		let username = req.body.username

		var token = jwt.sign({
			name: username
		}, process.env.APP_KEY, {
			expiresIn: "1440m"
		})

		res.json({
			success: true,
			message: "Successful",
			token: token
		})
		return
	},

	image: (req, res) => {
		let file = path.join(__dirname, "../tmp/" + req.params.image)
		if (!fs.existsSync(file)) {
			res.json({
				message: "File not found",
			})
			return
		}
		res.download(file)
		return
	},

	/** Generates thumbnail for the given url of public image*/
	thumbnail: (req, res) => {

		var dir = "./tmp"

		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir)
		}

		if (!req.body.url) {
			res.status(400).json({
				"message": "url missing"
			})
			return
		}
		const url = req.body.url

		//Regex for valid url
		const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

		if (!urlRegex.test(url)) {
			res.json({
				message: "Invalid url",
			})
			return
		}

		let host = URL.parse(url)

		if (host.protocol == null) {
			res.json({
				message: "Invalid url",
			})
			return
		}

		var protocol = host.protocol.slice(0, -1)

		var file = fs.createWriteStream("tmp/code.jpg")
		var client = null;
		(protocol == "https") ? client = https: client = http

		client.get(url, function (response) {

			// Regex to check for the image mime type
			const headerRegex = /(image\/).*/

			if (response.statusCode != 200 || !headerRegex.test(response.headers["content-type"])) {
				res.json({
					message: "Image not found on the given url",
				})
				return
			}

			response.on("data", function (data) {
				file.write(data)
			}).on("end", function () {
				file.end()
				sharp("tmp/code.jpg")
					.resize(SIZE, SIZE)
					.ignoreAspectRatio()
					.toBuffer()
					.then(data => {
						const fileName = Math.floor(Math.random() * 100000000) + 1
						fs.createWriteStream(`tmp/${fileName}.jpg`).write(data)
						res.status(200).json({
							resizedImage: process.env.APP_URL + "/api/image/" + fileName + ".jpg"
						})
						return
					})
					.catch(err => {
						res.json({
							message: "Error in resizing",
							error: err
						})
						return
					})
				return
			})
		})
	},

	/** Applying json patch */
	applyJsonPatch: (req, res) => {
		if (!req.body.obj) {
			res.status(400).json({
				"message": "Object is missing"
			})
			return
		}
		if (!req.body.patch) {
			res.status(400).json({
				"message": "Patch obj is missing"
			})
			return
		}
		let obj = req.body.obj
		let patch = req.body.patch
		var patcheddoc = null
		try {
			patcheddoc = jsonpatch.apply_patch(obj, [patch])
		} catch (error) {
			res.status(400).json({
				"message": "Not a valid patch object"
			})
			return
		}
		res.status(200).json({
			"new_json": patcheddoc
		})
		return
	}
}