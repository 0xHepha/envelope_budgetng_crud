const express = require("express")
const router = express.Router()

router.get("/", (req, res, next) => {
    console.log("Envelope router working")
    res.send("Working")
})
module.exports = router
