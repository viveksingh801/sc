"use strict"

const express = require("express")
require("dotenv").config()

const morgan = require("morgan")
const bodyParser = require("body-parser")
const apiRoutes = require("./routes/apiRoutes")

var fs = require("fs")
var path = require("path")
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
	flags: "a"
})


const PORT = process.env.PORT || 9090
const HOST = process.env.HOST || "0.0.0.0"

const app = express()

app.set("appKey", process.env.APP_KEY)

app.use(morgan("combined", {
	stream: accessLogStream
}))

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(bodyParser.json())
app.use (function (error, req, res, next){
	if(error){
		res.status(400).send({"msg": "Invalid json"})
		return
	}
})

app.use("/api", apiRoutes)

app.all("*", function (req, res) {
	res.status(400).send("Page not found")
	return
})


app.listen(PORT, HOST, () => {
	console.log(`Running on http://${HOST}:${PORT}`)
})