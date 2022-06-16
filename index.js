const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));


app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  var today  = new Date();

  app.get('/info', (req, res) => {
    res.send(`<p>Phonebook as info for ${persons.length} people</p> <p>${today.toLocaleDateString("en-UK", options)}</p>`)
  })

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
      })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }
        })
        .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    const id = Number(request.params.id)
    Person.findByIdAndDelete(request.params.id).then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))  
  })

  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (body.name === undefined) {
      return response.status(400).json({ error: 'name missing' })
    }
    if (body.number === undefined) {
        return response.status(400).json({ error: 'number missing' })
      }
  
    const person = new Person({
      name: body.name,
      number: body.number
     
    })
  
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})