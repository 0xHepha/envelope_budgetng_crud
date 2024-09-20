const express = require("express")
const router = express.Router()
const { getAllEnvelopes } = require("../db")

router.get("/", (req, res, next) => {
    res.send(getAllEnvelopes())
})
module.exports = router
