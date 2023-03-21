import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { SaveAnswers } from './db';

function OpenQuestion({ question, onSaveAnswer}) {
  const [answer, setAnswer] = useState('');

  const handleTextChange = (text) => {
    setAnswer(text);
  };
  
  const handleSave = async () => {
    await onSaveAnswer(question.questionId, answer);
  };

  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 30, color: '#1d71b8'  }}>{question.questionText}</Text>
      <TextInput
        placeholder="Only if you feel the need"
        style={{ height: 40, borderColor: '#1d71b8', borderWidth: 1 }}
        onChangeText={handleTextChange}
        value={answer}
        onSubmitEditing={handleSave}
      />
      <View style={{padding:30}}> 
        <Button title="Next question" onPress={handleSave} color="#1d71b8" />
      </View>
      
    </View>
  );
}

export default OpenQuestion;
