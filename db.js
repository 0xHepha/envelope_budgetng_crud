const data = [
    { id: 0, name: "Test", description: "Test dec", balance: 100 },
    { id: 1, name: "Test1", description: "", balance: 10 },
]
let newId = 2

/*
    let schemaExmaple = {
        id: 1,
        name: "Test",
        description: "",
        balance: 300,
    } 
*/

const getNewId = () => {
    return newId
}

class badInput extends Error {
    constructor(message, status = 400) {
        super(message)
        this.status = status // Add custom property
    }
}

const isEnvelopeValid = (envelope) => {
    let error
    if (!Object.hasOwn(envelope, "id")) {
        throw new badInput("property missing: id")
    }

    if (!Object.hasOwn(envelope, "name")) {
        throw new badInput("property missing: name")
    }
    if (!Object.hasOwn(envelope, "description")) {
        throw new badInput("property missing: description")
    }
    if (!Object.hasOwn(envelope, "balance")) {
        throw new badInput("property missing: balance")
    }

    if (typeof envelope.id != "number") {
        throw new badInput("ID must be a number")
    }

    if (envelope.id < 0) {
        throw new badInput("ID must be bigger or equal to 0")
    }

    if (typeof envelope.balance != "number") {
        throw new badInput("Balance must be a number")
    }

    if (envelope.balance < 0) {
        throw new badInput("Can't add a negative balance")
    }

    if (envelope.name.length < 2) {
        throw new badInput(
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
            return env.id === selector
        })
    } else {
        envelope = data.find((env) => {
            return env.name === selector
        })
    }

    return envelope
}

const getEnvelopeIndex = (selector) => {
    const byId = typeof selector === "number"

    let index = -1

    if (byId) {
        index = data.findIndex((env) => {
            return env.id === selector
        })
    } else {
        index = data.findIndex((env) => {
            return env.name === selector
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
        throw new badInput("An envelope with this name already exists")
    }
}

const changeEnvelope = (id, updatedEnvelope) => {
    isEnvelopeValid(updatedEnvelope)

    let index = getEnvelopeIndex(id)

    // Check to see it there is the name already exists
    let doubleIndex = getEnvelopeIndex(updatedEnvelope.name)
    if (doubleIndex != index && doubleIndex >= 0) {
        throw new badInput(
            "There is already an envelop with this name, please choose another"
        )
    }

    data[index] = updatedEnvelope
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
        throw new badInput(
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
        throw new badInput("There are no envelopes", 404)
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
    changeEnvelope,
    removeEnvelope,
    useEnvelope,
    addToEnevelope,
    addBalanceToAll,
}
