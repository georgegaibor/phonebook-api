let persons = require('./phonebook.json')

const express = require('express')
const morgan = require('morgan')
//const { requestLogger } = require('./middleware/logMware')
const { unknownEndpoint } = require('./middleware/unknownEndpointMware')
const app = express()

app.use(express.json())

morgan.token('data', (req,res)=>{
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :data :res[content-length] :response-time ms'))

//GET HOME
app.get('/info', (request, response) => {
    response.send(
        `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
        `
    )
})

//GET ALL
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//GET ONE
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.statusMessage = 'Not in phonebook'
        response.status(404).end()
    }
})

//DELETE
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const people = persons.filter(person => person.id !== id)
    response.status(204).end()
})

//POST
const checkExist = (requestName) => {
    const found = persons.find(person => person.name === requestName)
    return found
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }else if(checkExist(body.name)) {
        return response.status(400).json({
            error: 'Name should be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random()*100),
        name: body.name,
        number: body.number
    }

    persons = [...persons, person]
    response.json(person)
})

app.use(unknownEndpoint)

const PORT = 5000
app.listen(PORT, () => {
    console.log(`${PORT}`)
})
