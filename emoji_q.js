import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

  const handlePress = async (option) => {
    setAnswer(option);
    await onSaveAnswer(question.questionId, getSmileyTextValue(option));
  };

  return (
    <View>
      <Text>{question.questionText}</Text>
      {question.radioOptions.map((option) => (
        <SmileyOption
          key={option}
          option={option}
          onPress={handlePress}
          selected={answer === option}
        />
      ))}
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
