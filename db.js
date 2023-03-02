import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('db.db');


db.transaction(tx => {
  tx.executeSql('DROP TABLE IF EXISTS answers;');
 tx.executeSql(`
   CREATE TABLE IF NOT EXISTS answers (
     questionId INTEGER,
     answer TEXT,
     dateAnswered TEXT,
     dateAnsweredISO TEXT,
     timestamp INTEGER PRIMARY KEY
   );
 `);
});


export function SaveAnswers(questionId, answer) {
 const timestamp = new Date().getTime();
 const dateAnswered = new Date().toLocaleString();
//  const dateAnsweredISO = new Date(timestamp).toISOString().slice(0, 10);
  const dateAnsweredISO = "5";
 return new Promise((resolve, reject) => {
   db.transaction(
     tx => {
       tx.executeSql(
         `INSERT INTO answers (questionId, answer, dateAnswered, dateAnsweredISO, timestamp) VALUES (?, ?, ?, ?, ?);`,
         [questionId, answer, dateAnswered, dateAnsweredISO, timestamp],
         (_, result) => {
           console.log('Answer stored');
           resolve(result);
         },
         (_, error) => {
           console.log('Error storing answer:', error);
           reject(error);
         }
       );
     }
   );
 });
}

export function isAnswered(questionId) {
//  const today = new Date().toISOString().slice(0, 10);
  const today = "5";
 return new Promise((resolve, reject) => {
   db.transaction(tx => {
     tx.executeSql(
       `SELECT * FROM answers WHERE questionId = ? AND dateAnsweredISO = ?;`,
       [questionId, today],
       (_, { rows }) => {
         const isAnswered = rows.length > 0;
         resolve(isAnswered);
       },
       (_, error) => {
         console.log('Error checking if question is answered:', error);
         reject(error);
       }
     );
   });
 });
}

export async function getAnswers() {
return new Promise((resolve, reject) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT questionId, answer, dateAnswered, timestamp FROM answers;',
      [],
      (_, { rows }) => {
        const answers = {};
        for (let i = 0; i < rows.length; i++) {
          const answer = rows.item(i);
          answers[answer.timestamp] = {
            timestamp: answer.timestamp,
            questionId: answer.questionId,
            answer: answer.answer,
            dateAnswered: answer.dateAnswered
          };
        }
       console.log('Answers:', answers);
       resolve(answers);
      },
      (_, error) => {
        console.log('Error getting answers:', error);
        reject(error);
      }
    );
  });
});
}

