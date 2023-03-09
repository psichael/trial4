import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SaveAnswers } from './db';






function RadioQuestion({ question, onSaveAnswer }) {
 const [answer, setAnswer] = useState(null);
    const handlePress = async (option) => {
      console.log('before: ', answer)
        setAnswer(option);
        console.log('after: ', answer)
        
 await onSaveAnswer(question.questionId, option);
 };
  return (


    
 <View>
 <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#007AFF' }}>{question.questionText}</Text>
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
 <View style={{ padding: 10 }}>
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
