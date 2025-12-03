import { useState, useEffect } from "react"
import server from "./JASON.JS/server"; 
import Filter from "./componet/Filter";
import Persons from "./componet/person";   // ← si tu archivo se llama "person.jsx", esto está bien
import Notification from "./componet/Notification";
import PersonForm from "./componet/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [filter, setFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState("success")

  useEffect(() => {
    server
      .getAll()
      .then((initialPersons) => {
        // Asegurar que sea un arreglo
        if (Array.isArray(initialPersons)) {
          setPersons(initialPersons)
        } else {
          setPersons([])   // evita crash
        }
      })
      .catch(() => setPersons([]))
  }, [])

  const showMessage = (text, type = "success") => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => setMessage(null), 4000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (newName.trim() === "" || newNumber.trim() === "") {
      showMessage("You need to write a name and a number!", "error")
      return
    }

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      if (window.confirm(`${newName} is already added. Replace the old number with the new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        server
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p => p.id !== existingPerson.id ? p : returnedPerson)
            )
            setNewName("")
            setNewNumber("")
            showMessage(`Updated ${newName}'s number successfully!`, "update")
          })
          .catch(() => {
            showMessage(
              `Information of ${newName} has already been removed from server`,
              "error"
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const newPerson = { name: newName, number: newNumber }

      server
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName("")
          setNewNumber("")
          showMessage(`${newName} added successfully!`, "success")
        })
        .catch(() => {
          showMessage("Error adding the person", "error")
        })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      server
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`${name} deleted`, "error")
        })
        .catch(() => {
          showMessage(
            `The person '${name}' was already removed from the server`,
            "error"
          )
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  // aseguramos evitar error si persons NO es un arreglo
  const personsToShow = Array.isArray(persons)
    ? persons.filter(p =>
        p.name.toLowerCase().includes(filter.toLowerCase())
      )
    : []

  return (
    <div>
      <h2>PhoneBook</h2>
      <Notification message={message} type={messageType} />

      <Filter filter={filter} handleFilterChange={(e) => setFilter(e.target.value)} />

      <h3>Add a person</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App
