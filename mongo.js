require('dotenv').config()

const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}


const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,

})

const Person = mongoose.model('Person', personSchema)

const name = process.argv[2]
const number = process.argv[3]

if(name && number) {
    const person = new Person({
      name: name,
      number: number
    
    })
    
    person.save().then(result => {
      console.log(`Added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })

} else {
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })

}
