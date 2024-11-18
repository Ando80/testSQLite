import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import db, { setupDatabase } from "./src/database";

const App = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    setupDatabase();
    loadContacts();
  }, []);

  const loadContacts = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM contacts;",
        [],
        (_, { rows: { _array } }) => setContacts(_array),
        (_, error) => console.error(error)
      );
    });
  };

  const addContact = () => {
    if (name && phone && email) {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?);",
          [name, phone, email],
          () => loadContacts(),
          (_, error) => console.error(error)
        );
      });
      setName("");
      setPhone("");
      setEmail("");
    }
  };

  const deleteContact = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM contacts WHERE id = ?;",
        [id],
        () => loadContacts(),
        (_, error) => console.error(error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contacts</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="phone"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Add Contact" onPress={addContact} />
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text>{item.name}</Text>
            <Text>{item.phone}</Text>
            <Text>{item.email}</Text>
            <Button title="delete" onPress={() => deleteContact(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  contactItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
});

export default App;
