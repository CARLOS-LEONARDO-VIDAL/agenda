  const Persons = ({ persons, handleDelete }) => {
    return (
      <ul>
        {persons.map(persons => (
          <li key={persons.id}>
            {persons.name} {persons.number}
            <button className="boton2"onClick={() => handleDelete(persons.id, persons.name)}>delete</button>
          </li>
        ))}
      </ul>
    )
  }

  export default Persons