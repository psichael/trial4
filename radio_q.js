import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SaveAnswers } from './db';






function RadioQuestion({ question, onSaveAnswer }) {
 const [answer, setAnswer] = useState(null);
  const handlePress = async (option) => {
 setAnswer(option);
 await onSaveAnswer(question.questionId, option);
 };
  return (
 <View>
 <Text>{question.questionText}</Text>
 {question.radioOptions.map((option) => (
 <RadioOption
 key={option}
 option={option}
 onPress={handlePress}
 selected={answer === option}
 />
 ))}
 </View>
 );
 }
  function RadioOption({ option, onPress, selected }) {
 return (
 <View style={{ padding: 5 }}>
 <Text
 onPress={() => onPress(option)}
 style={{ fontSize: 20, color: selected ? 'blue' : 'black' }}
 >
 {option}
 </Text>
 </View>
 );
 }


 export default RadioQuestion;
