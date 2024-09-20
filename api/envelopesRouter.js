const express = require("express")
const router = express.Router()
const { getAllEnvelopes, addEnvelope, getEnvelope } = require("../db")

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
    let validId = Number(id)
    console.log(validId)
    console.log(typeof validId)
    if (isNaN(validId)) {
        console.log("Hit")
        return res.status(500).send("Envelope Id must be a number")
    } else {
        req.id = validId
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
        let status = err.status | 500
        res.status(status).send(err.message)
    }
})

module.exports = router
