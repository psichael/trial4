import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { SaveAnswers } from './db';






function RadioQuestion({ question, onSaveAnswer }) {
  const [answer, setAnswer] = useState(null);

  const handlePress = async (option) => {
    setAnswer(option);
  };

  const handleSave = async () => {
    await onSaveAnswer(question.questionId, answer, '');
  };

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#007AFF' }}>{question.questionText}</Text>
      {question.radioOptions.map((option) => (
        <TouchableOpacity key={option} onPress={() => handlePress(option)}>
          <View style={{ padding: 10 }}>
            <Text style={{ fontSize: 20, color: answer === option ? 'blue' : 'black' }}>{option}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Button title="Next question" onPress={handleSave} />
    </View>
  );
}


 export default RadioQuestion;
