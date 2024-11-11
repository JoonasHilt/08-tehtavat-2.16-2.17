import React from "react";

const Persons = ({ persons, removePerson }) => (
  <div>
    {persons.map((person) => (
      <div key={person.name}>
        {person.name} {person.number}
        <button onClick={() => removePerson(person.id, person.name)}>
          Delete
        </button>
      </div>
    ))}
  </div>
);

export default Persons;
