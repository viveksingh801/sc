const express = require("express")
const router = express.Router()

const previewController = require("../controllers/previewController")

router.get('/1', previewController.index)

module.exports = router