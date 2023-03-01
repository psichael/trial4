import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button } from 'react-native';
import { SaveAnswers } from './db';

function OpenQuestion({ question, onSaveAnswer, onNextQuestion}) {
  const [answer, setAnswer] = useState('');

  const handleTextChange = (text) => {
    setAnswer(text);
  };
  
  const handleSave = async () => {
    await onSaveAnswer(question.questionId, answer);
  };

  return (
    <View>
      <Text>{question.questionText}</Text>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        onChangeText={handleTextChange}
        value={answer}
        onSubmitEditing={handleSave}
      />
      <Button title="Next question" onPress={handleSave} />
    </View>
  );
}

export default OpenQuestion;
