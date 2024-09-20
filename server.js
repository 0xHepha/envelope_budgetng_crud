const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const errorHandler = require("error-handler")

const app = express()

const PORT = 4001

app.use(bodyParser.json())

app.use("/api/v1", apiRouter)
app.use(cors())

const apiRouter = require("./api")

app.use(errorHandler())

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
})
