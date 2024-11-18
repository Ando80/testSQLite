import * as SQLite from "expo-sqlite/legacy";

const db = SQLite.openDatabase("contacts.db");

export const setupDatabase = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS contacts (
         id INTEGER PRIMARY KEY IF NOT NULL,
         name TEXT,
         phone TEXT,
         email TEXT
       );`
    );
  });
};

export default db;
