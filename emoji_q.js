import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';

const getSmileyTextValue = (smiley) => {
  switch (smiley) {
    case "😭":
      return "Very sad";
    case "🙁":
      return "Sad";
    case "😐":
      return "Neutral";
    case "🙂":
      return "Happy";
    case "😀":
      return "Very happy";
    default:
      return "";
  }
};

function EmojiQuestion({ question, onSaveAnswer }) {
  const [answer, setAnswer] = useState(null);
  const [remark, setRemark] = useState('');

  const handlePress = async (option) => {
    setAnswer(option);
    
  };

  const handleTextChange = (text) => {
    setRemark(text);
  };

  const handleSave = async () => {
    await onSaveAnswer(question.questionId, getSmileyTextValue(answer), remark);
  };

  return (
    <View>
      <Text>{question.questionText}</Text>
      {question.answerType === 'smilies' &&
        question.radioOptions.map((option) => (
          <SmileyOption
            key={option}
            option={option}
            onPress={handlePress}
            selected={answer === option}
          />
        ))}
      
      {question.hasRemarks && (
       <View>
        <Text>Remark:</Text>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            value={remark}
            onChangeText={handleTextChange}
            onSubmitEditing={handleTextChange}
          />
       </View>
      )}
      <Button title="Next question" onPress={handleSave} />
    </View>
  );
}

function SmileyOption({ option, onPress, selected }) {
  return (
    <View style={{ padding: 5 }}>
      <Text
        onPress={() => onPress(option)}
        style={{ fontSize: 30, color: selected ? 'blue' : 'black' }}
      >
        {option}
      </Text>
    </View>
  );
}

export default EmojiQuestion;
