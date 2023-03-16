import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, Image, TouchableOpacity, Button, Switch} from 'react-native';
import { getNextQuestion } from './question_controller';
import { SaveAnswers, gDPR } from './db';
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
 const [shouldRender, setShouldRender] = useState(false);
 
 const handleGetNextQuestion = async () => {
  // Check if GDPR question has been answered
  const gdprAnswered = await gDPR(9999);
   
  if (!gdprAnswered) {
    // If GDPR question hasn't been answered, render the GDPR component
    setShouldRender(true);
    
  } else {
    // If GDPR question has been answered, fetch the next question
    setShouldRender(false);
    const nextQuestion = await getNextQuestion();
    
    if (nextQuestion) {
      setQuestion(nextQuestion);
      return false;
    } else {
      return true;
    }
  }
};

const handleSaveAnswer = async (questionId, answer, remark) => {
  if (answer) {
    await SaveAnswers(questionId, answer, remark);
    await handleGetNextQuestion();    
  }
};


useEffect(() => {
  const scheduleNotifications = async () => {
    try {
      // Schedule daily notifications at noon between the start and end dates
      const startDate = new Date('2023-03-01');
      const endDate = new Date('2023-03-31');
      const now = new Date();

      if (now >= startDate && now <= endDate) {
        const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
        const scheduledNotificationIds = scheduledNotifications.map((notification) => notification.identifier);

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          const notificationId = `notification_${date.toISOString()}`;

          // Check if the notification has already been scheduled for the day
          const alreadyScheduled = scheduledNotificationIds.includes(notificationId);

          // Get the next question to check if it is the last one for the day
          const nextQuestion = await handleGetNextQuestion();

          // Check if there are no more questions to answer for the current day
          const noMoreQuestions = !nextQuestion && date.toDateString() === now.toDateString();

          // Schedule a notification for the day, except for today if there are no more questions to answer
          if ((!alreadyScheduled || (noMoreQuestions && !nextQuestion))) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Reminder',
                body: 'Hi, there are new questions waiting for your answer!',
              },
              trigger: {
                hour: 12,
                minute: 0,
                repeats: true,
              },
              identifier: notificationId,
            });
          }
          // Check if the user has answered all questions for the day and remove the notification
          if (alreadyScheduled && noMoreQuestions) {
            await Notifications.cancelScheduledNotificationAsync(notificationId);
          }
        }
      }
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  };

  scheduleNotifications();
});


useEffect(() => {
  handleGetNextQuestion();
}, []);

if (shouldRender) {
  return <GDPR onSaveAnswer={handleSaveAnswer} />;
}
 
function GDPR({ onSaveAnswer }) {
  const [isChecked, setIsChecked] = useState(false);
  
  const handleSave = async () => {
    if (isChecked) {
      await onSaveAnswer(9999, 'Yes');
      setShouldRender(false); 
      handleGetNextQuestion();
    }
  };

  return (
    <View style={styles.GPDRcontainer}>
      <View style={styles.logoContainer}>
        <Image source={require('./assets/logo-big.png')} style={styles.logo} />
      </View>
      <Text style={{fontSize:20, padding: 20, marginTop: 40}}>
        Welcome our research app.
      </Text>
      <Text style={{marginBottom: 20}}>
          This app will collect your answers to questions about your wellbeing during your journey. At the end of the survey, you can send the answers to us by email. Your questions will then be anonymized before processing and the email with your answers deleted. Do you agree to collaborate with our research? ',
      </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Switch
          value={isChecked}
          onValueChange={(value) => setIsChecked(value)}
        />
        <Text style={{fontSize: 20, marginLeft: 10}}>Yes</Text>
      </View>
      <View style={{padding: 30} }>
        <Button title="Let's get started!" onPress={handleSave} color="#1d71b8"  />
      </View>
    </View>
  );
}




return (
  <KeyboardAvoidingView style={styles.container} behavior="height">
    <View style={styles.logoContainer}>
      <Image source={require('./assets/logo-big.png')} style={styles.logo} />
    </View>
    {question && question.questionId !== 0 ? (
      <View style={[styles.questionContainer, { zIndex: 1 }]}>
        <QuestionView question={question} onSaveAnswer={handleSaveAnswer} style={styles.question} />
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
  PRIMARY: '#1d71b8', // Blue
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
  GPDRcontainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 60,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 30,
    },
    logo: {
      width: 100,
      height: 77,
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
    borderColor: '#1d71b8'
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