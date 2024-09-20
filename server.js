const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const errorHandler = require("error-handler")
const morgan = require("morgan")

const app = express()

const PORT = 4001

app.use(cors())
app.use(bodyParser.json())

app.use(morgan("dev"))

const apiRouter = require("./api")
app.use("/api/v1", apiRouter)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`API running on port ${PORT}`)
})
