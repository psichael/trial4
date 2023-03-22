import * as SQLite from 'expo-sqlite';


const db = SQLite.openDatabase('db.db');


db.transaction(tx => {
//  tx.executeSql('DROP TABLE IF EXISTS answers;');
 tx.executeSql(`
   CREATE TABLE IF NOT EXISTS answers (
     questionId INTEGER,
     answer TEXT,
     dateAnswered TEXT,
     dateAnsweredISO TEXT,
     remark TEXT,
     timestamp INTEGER PRIMARY KEY
   );
   
 `);
});

export function SaveAnswers(questionId, answer, remark) {
 const timestamp = new Date().getTime();
 const dateAnswered = new Date().toLocaleString();
 const dateAnsweredISO = new Date(timestamp).toISOString().slice(0, 10);
//  const dateAnsweredISO = "7";
  
 return new Promise((resolve, reject) => {
   db.transaction(
     tx => {
      tx.executeSql(
        `INSERT INTO answers (questionId, answer, dateAnswered, dateAnsweredISO, remark, timestamp) VALUES (?, ?, ?, ?, ?, ?);`,
        [questionId, answer, dateAnswered, dateAnsweredISO, remark, timestamp],
        (_, result) => {         
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
 const today = new Date().toISOString().slice(0, 10);
//  const today = "7";
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

export function gDPR(questionId) {
  const sqlQuery = "SELECT COUNT(*) AS count FROM answers WHERE questionId = ?";
  const params = [questionId];
  
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(sqlQuery, params, (_, { rows }) => {
        const count = rows.item(0).count;
        resolve(count > 0);
      }, (_, error) => {
        console.log('Error checking if GDPR is answered:', error);
        reject(error);
      });
    });
  });
}

export async function getAnswers() {
return new Promise((resolve, reject) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT questionId, answer, dateAnswered, remark, timestamp FROM answers;',
      [],
      (_, { rows }) => {
        const answers = {};
        for (let i = 0; i < rows.length; i++) {
          const answer = rows.item(i);
          answers[answer.timestamp] = {
            timestamp: answer.timestamp,
            questionId: answer.questionId,
            answer: answer.answer,
            dateAnswered: answer.dateAnswered,
            remark: answer.remark
          };
        }
       
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


