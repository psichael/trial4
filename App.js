import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image} from 'react-native';
import { getNextQuestion } from './question_controller';
import { SaveAnswers } from './db';
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
    try {
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
        if (scheduledNotifications) {
          const alreadyScheduled = scheduledNotifications.some(
            (notification) => notification.identifier === 'my_notification_id'
          );
  
          if (!alreadyScheduled) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Reminder',
                body: 'Hi, there are new questions waiting for your answer!',
              },
              trigger,
              identifier: 'my_notification_id',
            });
          }
        }
      }
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };
  
  scheduleNotifications();
}, []);

 
return (
  <KeyboardAvoidingView style={styles.container} behavior="height">
      <View style={styles.logoContainer}>
        <Image source={require('./assets/logo.svg')} style={styles.logo} />
      </View>
      {question && question.questionId !== 0 ? (
        <View style={[styles.questionContainer, { zIndex: 1 }]}>
          <QuestionView question ={question} onSaveAnswer={handleSaveAnswer} style={styles.question} />
    </View>
  ) : (
    <>
      <View style={[styles.noQuestionContainer, { zIndex: 1 }]}>
        <Text style={styles.noQuestionText}>No more questions</Text>
      </View>
      <View style={styles.shareAnswersContainer}>
        <ShareAnswers />
      </View>
    </>
  )}
</KeyboardAvoidingView>
);
};

const COLORS = {
  PRIMARY: '#007AFF', // Blue
  SECONDARY: '#FF3B30', // Red
  LIGHT_BLUE: '#B0E0E6',
  LIGHT_RED: '#FFC0CB',
};

const FONT_SIZE = 16;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 50,
      },
  questionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  question: {
    color: COLORS.PRIMARY,
    padding: 10,
    fontSize: 24,
    borderWidth: 5,
    borderColor: '#007AFF'
  },
  noQuestionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noQuestionText: {
    marginBottom: 20,
    fontSize: FONT_SIZE,
    color: COLORS.PRIMARY,
  },
  shareAnswersContainer: {
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
  },
});