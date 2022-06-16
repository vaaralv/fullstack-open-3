const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
app.use(express.static('build'))


app.use(cors())

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));


app.use(express.json())


let persons = [
  {
      id: 1,
      name: "Hanna Hämäläinen",
      number: '040 123 3412'
  },
  {
    id: 2,
    name: "Johannes Rantala",
    number: '040 222 3312'
},
{
    id: 3,
    name: "Venla Väärälä",
    number: '040 111 2212'
},
{
    id: 4,
    name: "Ismo Väärälä",
    number: '040 123 5512'
}
]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  var today  = new Date();

  app.get('/info', (req, res) => {
    res.send(`<p>Phonebook as info for ${persons.length} people</p> <p>${today.toLocaleDateString("en-UK", options)}</p>`)
  })
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    } else {
        if (persons.find(person => person.name === body.name)) {
            return response.status(400).json({ 
              error: 'name already exists' 
            })
          }
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'number missing' 
        })
      }

   
  
    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})