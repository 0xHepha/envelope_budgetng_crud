const express = require("express")
const router = express.Router()
const {
    getAllEnvelopes,
    addEnvelope,
    getEnvelope,
    changeEnvelope,
    useEnvelope,
    addToEnevelope,
    removeEnvelope,
    getEnvelopeIndex,
} = require("../db")

const createEnvelopeObject = (req, res, next) => {
    // Create base schame, at this point we don't know where it will be used
    let newEnvelope = {
        name: req.body.name,
        description: req.body.description,
        balance: req.body.balance,
    }

    // If it has an Id, then it already exists, so we can append it
    if (req.body.id != undefined) {
        newEnvelope.id = req.body.id
    }

    // add it
    req.envelope = newEnvelope
    next()
}

router.param("envelopeId", (req, res, next, id) => {
    req.id = id
    if (!positiveNumber(req.id)) {
        return res.status(400).send("Envelope Id must be a number")
    } else {
        next()
    }
})

const positiveNumber = (num) => {
    let validNumber = Number(num)
    if (isNaN(validNumber) || validNumber < 0) {
        return false
    }

    return true
}

router.param("amount", (req, res, next, id) => {
    req.amount = Number(id)
    if (!positiveNumber(Number(req.amount))) {
        return res.status(400).send("Amount must be a positive number")
    } else {
        next()
    }
})

router.get("/", (req, res, next) => {
    res.send(getAllEnvelopes())
})

router.get("/:envelopeId", (req, res, next) => {
    let envelope = getEnvelope(req.id)
    if (envelope) {
        res.send(envelope)
    } else {
        res.status(404).send(`There isn't any envelope with id ${req.id}`)
    }
})

router.post("/", createEnvelopeObject, (req, res, next) => {
    res.setHeader("content-type", "application/json")
    try {
        addEnvelope(req.envelope)
        let createdEnvelope = getEnvelope(req.envelope.name)
        if (createdEnvelope) {
            res.status(201).send(createdEnvelope)
        } else {
            res.status(500).send(
                "Something went wrong, couldn't add the new envelope to the list"
            )
        }
    } catch (err) {
        let status = err.status || 500
        res.status(status).send(err.message)
    }
})

router.put("/:envelopeId", createEnvelopeObject, (req, res, next) => {
    // If the object to update has an ID by chance, make sure it matches with the endpoint one
    if (req.envelope.id != undefined) {
        if (req.envelope.id != req.id) {
            res.status(404).send(
                `ID ${req.id} specified on URL but ID ${req.envelope.id} on sent object`
            )
        }
    } else {
        req.envelope.id = req.id
    }

    try {
        changeEnvelope(req.id, req.envelope)

        let updatedEnvelope = getEnvelope(req.id)

        res.status(201).send(updatedEnvelope)
    } catch (error) {
        let status = error.status || 500
        res.status(status).send(error.message)
    }
})

const updateEnvelopeBalance = (req, res, next) => {
    try {
        req.updateFunction(req.id, req.amount)
        let updatedEnvelope = getEnvelope(req.id)
        res.status(201).send(updatedEnvelope)
    } catch (error) {
        res.status(error.status || 500).send(error.message)
    }
}

router.put(
    "/:envelopeId/use/:amount",
    (req, res, next) => {
        req.updateFunction = useEnvelope
        next()
    },
    updateEnvelopeBalance
)

router.put(
    "/:envelopeId/add/:amount",
    (req, res, next) => {
        req.updateFunction = addToEnevelope
        next()
    },
    updateEnvelopeBalance
)

router.delete("/:envelopeId", (req, res, next) => {
    try {
        let envelope = getEnvelope(req.id)
        if (envelope) {
            removeEnvelope(envelope)

            res.status(204).send()
        } else {
            res.status(404).send(`There isn't any envelope with ID ${req.id}`)
        }
    } catch (error) {
        res.status(error.status || 500).send(error.message)
    }
})

router.put("/transfer/:amount", (req, res, next) => {
    const fromId = Number(req.query.from)
    const toId = Number(req.query.to)
    console.log(`IDS ${fromId}    ${toId}`)

    if (!positiveNumber(fromId) || !positiveNumber(toId)) {
        return res.status(400).send("ID parameter must be a positive number")
    }

    // Get indexes just to make sure they exist, will throw error if not
    try {
        let index1 = getEnvelopeIndex(fromId)
        let index2 = getEnvelopeIndex(toId)

        console.log(`${index1}    ${index2}`)
        //Remove first since its the only one who trows error if balance is insuficient
        useEnvelope(fromId, req.amount)
        addToEnevelope(toId, req.amount)

        const envelopeFrom = getEnvelope(fromId)
        const envelopeTo = getEnvelope(toId)

        console.log(envelopeFrom)
        console.log(envelopeTo)

        const newBalances = [
            { id: fromId, balance: envelopeFrom.balance },
            { id: toId, balance: envelopeTo.balance },
        ]

        res.status(201).send(newBalances)
    } catch (error) {
        res.status(error.status || 500).send(error.message)
    }
})

module.exports = router
