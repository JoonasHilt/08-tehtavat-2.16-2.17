import React, { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import addPersons from "./services/addPersons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [notificationType, setNotificationType] = useState("success");

  useEffect(() => {
    addPersons.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification(message);
    setNotificationType(type);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const addPerson = (event) => {
    event.preventDefault();

    const newNameLower = newName.toLowerCase();
    const existingPerson = persons.find(
      (person) => person.name.toLowerCase() === newNameLower
    );

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
        )
      ) {
        const updatedPerson = { ...existingPerson, number: newNumber };

        addPersons
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            showNotification(`Updated ${returnedPerson.name}`, "success");
          })
          .catch((error) => {
            console.log("Error updating person:", error);
            showNotification(
              "An error occurred while updating the person",
              "error"
            );
          });
      }
      return;
    }

    const newPerson = { name: newName, number: newNumber };

    addPersons
      .create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        showNotification(`Added ${returnedPerson.name}`, "success");
      })
      .catch((error) => {
        console.log("Error adding person:", error);
        showNotification("An error occurred while adding the person", "error");
      });
  };

  const removePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      addPersons
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          showNotification(`Deleted ${name}`, "success");
        })
        .catch((error) => {
          console.log("Error deleting person:", error);
          showNotification(
            "An error occurred while deleting the person",
            "error"
          );
        });
    }
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPersons = persons.filter((person) => {
    const firstName = person.name.split(" ")[0].toLowerCase();
    const searchValue = searchTerm.toLowerCase();
    return firstName.startsWith(searchValue);
  });

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      {notification && <div className={notificationType}>{notification}</div>}
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={filteredPersons} removePerson={removePerson} />
    </div>
  );
};

export default App;
