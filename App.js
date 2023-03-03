import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { getNextQuestion } from './question_controller';
import { SaveAnswers } from './db'; // add this line
import * as Notifications from 'expo-notifications';

import EmojiQuestion from './emoji_q';
import OpenQuestion from './open_q';
import RadioQuestion from './radio_q';
import ShareAnswers from './share_answers';



function QuestionView({ question, onSaveAnswer }) {
 if (!question || question.questionId === 0) {
   return <Text style={{ marginBottom: 20 }}>No more questions</Text>;
 }
switch (question.answerType) {
 case 'smilies':
    return <EmojiQuestion key={question.questionId} question={question} onSaveAnswer={onSaveAnswer} />;
 case 'radios':
   return <RadioQuestion key={question.questionId} question={question} onSaveAnswer={onSaveAnswer} />;
 case 'text':
   return <OpenQuestion key={question.questionId} question={question} onSaveAnswer={onSaveAnswer} />;
 default:
   return null;
}
}

export default function App() {
 const [question, setQuestion] = useState(null);
 
  const handleGetNextQuestion = async () => {
 const nextQuestion = await getNextQuestion();
 setQuestion(nextQuestion);
 };
  
 const handleSaveAnswer = async (questionId, answer, remark) => {
  
    await SaveAnswers(questionId, answer, remark);    
 
  await handleGetNextQuestion();
};


 useEffect(() => {
 handleGetNextQuestion();
 }, []);
  
 useEffect(() => {
  const scheduleNotifications = async () => {
    // Get the next question to check if it is the last one for the day
    const nextQuestion = await getNextQuestion();

    if (!nextQuestion || nextQuestion.questionId === 0) {
      // No more questions for today, so don't schedule a notification
      return;
    }

    // Schedule daily notifications at 1pm between the start and end dates
    const startDate = new Date('2023-03-01');
    const endDate = new Date('2023-03-31');

    const now = new Date();
    if (now >= startDate && now <= endDate) {
      const trigger = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 59); // schedule notification at 1pm

      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const alreadyScheduled = scheduledNotifications.some(
        (notification) => notification.trigger.getTime() === trigger.getTime()
      );

      if (!alreadyScheduled) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Reminder',
            body: 'Hi, there are new questions waiting for your answer!',
          },
          trigger,
        });
      }
    }
  };

  scheduleNotifications();
}, []);

 
 return (
 <View style={styles.container}>
 {question && question.questionId !== 0 ? (
 <QuestionView question={question} onSaveAnswer={handleSaveAnswer} />
 ) : (
 <Text style={{ marginBottom: 20 }}>No more questions</Text>
 )}
 
 <ShareAnswers />
 </View>
 );
}
const styles = StyleSheet.create({
container: {
 flex: 1,
 backgroundColor: '#fff',
 alignItems: 'center',
 justifyContent: 'center',
 padding: 20,
},
});