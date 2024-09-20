const data = [
    { id: 0, name: "Test", description: "Test dec", balance: 100 },
    { id: 1, name: "Test1", description: "", balance: 10 },
]
const newId = 0

/* let schemaExmaple = {
    id: 1,
    name: "Test",
    description: "",
    balance: 300,
} */

const getNewId = () => {
    return newId
}

const isEnvelopeValid = (envelope) => {
    if (!Object.hasOwn(envelope, "id")) {
        throw new Error("property missing: id")
    }

    if (!Object.hasOwn(envelope, "name")) {
        throw new Error("property missing: name")
    }
    if (!Object.hasOwn(envelope, "description")) {
        throw new Error("property missing: description")
    }
    if (!Object.hasOwn(envelope, "balance")) {
        throw new Error("property missing: balance")
    }

    if (typeof envelope.id != "number") {
        throw new Error("ID muest be a number")
    }

    if (typeof envelope.balance != "number") {
        throw new Error("Balance must be a number")
    }

    if (envelope.name.length < 2) {
        throw new Error(
            "The name of the envelope cointain atleast 2 charachters "
        )
    }
}

const getAllEnvelopes = () => {
    return data
}

const getEnvelope = (selector) => {
    // Check ot see it the envelope will be found by id or by name
    const byId = typeof selector === "number"
    let envelope = false
    if (byId) {
        envelope = data.find((env) => {
            env.id === selector
        })
    } else {
        envelope = data.find((env) => {
            env.name === selector
        })
    }

    return envelope
}

const getEnvelopeIndex = (selector) => {
    const byId = typeof selector === "number"
    let index = -1
    if (byId) {
        index = data.findIndex((env) => {
            env.id === selector
        })
    } else {
        index = data.findIndex((env) => {
            env.name === selector
        })
    }

    return index
}

const addEnvelope = (newEnvelope) => {
    newEnvelope.id = getNewId()
    let exists = getEnvelope(newEnvelope.name)
    if (!exists) {
        isEnvelopeValid(newEnvelope)
        data.push(newEnvelope)
        newId++
    } else {
        throw new Error("An envelope with this name already exists")
    }
}

const removeEnvelope = (envelope) => {
    let index = getEnvelopeIndex(envelope.id)
    if (index > -1) {
        data.splice(index, 1)
    }
}

const useEnvelope = (selector, amount) => {
    let envelope = getEnvelope(selector)
    if (envelope.balance < amount) {
        throw new Error(
            `Insuficient balance in this envelope, only ${envelope.balance} remains`
        )
    }

    envelope.balance -= amount
}

const addToEnevelope = (selector, amount) => {
    let envelope = getEnvelope(selector)
    envelope.balance += amount
}

const addBalanceToAll = (amount) => {
    if (data.length <= 0) {
        throw new Error("There are no envelopes")
    }
    let each = amount / data.length

    data.forEach((env) => {
        env.balance += each
    })
}

module.exports = {
    getAllEnvelopes,
    getEnvelope,
    getEnvelopeIndex,
    addEnvelope,
    removeEnvelope,
    useEnvelope,
    addToEnevelope,
    addBalanceToAll,
}
