const express = require("express")
const router = express.Router()

const envelopesRouter = require("./api/envelopesRouter")

router.use("/envelopes", envelopesRouter)

module.exports = router
