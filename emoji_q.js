import React, { useState } from 'react';
import { Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

const getEmojiTextValue = (emoji) => {
  switch (emoji) {
    case "DE1E":
      return "Very sad";
    case "DE41":
      return "Sad";
    case "DE10":
      return "Neutral";
    case "DE42":
      return "Happy";
    case "DE03":
      return "Very happy";
    default:
      return "";
  }
};

function EmojiQuestion({ question, onSaveAnswer }) {
  const [answer, setAnswer] = useState('');
  const [remark, setRemark] = useState('');
  const [emoji, setEmoji] = useState('');

  const handleEmojiPress = (option) => {
    const emoji = option.charCodeAt(1).toString(16).toUpperCase();
    setEmoji(emoji);
    setAnswer(option);
  };

  const handleTextChange = (text) => {
    setRemark(text);
  };

  const handleSave = async () => {
    await onSaveAnswer(question.questionId, getEmojiTextValue(emoji), remark);    
  };

  return (
    <View>
      <KeyboardAvoidingView behavior="position" contentContainerStyle={{ paddingBottom: 60 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#1d71b8' }}>{question.questionText}</Text>
        {question.answerType === 'smilies' &&
          question.radioOptions.map((option) => (
            <SmileyOption
              key={option}
              option={option}
              onPress={handleEmojiPress}
              selected={answer === option}
              onSubmitEditing={handleSave}
            />
          ))}

        <View style={{marginTop:20}}>

          <Text>Remark:</Text>
          <TextInput
            placeholder="Only if you feel the need"
            style={{ height: 40, borderColor: '#1d71b8', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5 }}
            value={remark}
            onChangeText={handleTextChange}
            onSubmitEditing={handleSave}
          />


        </View>
        <View style={{padding: 30}}>
          <Button title="Next question" onPress={handleSave} color="#1d71b8"/>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}


function SmileyOption({ option, onPress, selected }) {
  const emoji = option.charCodeAt(1).toString(16).toUpperCase();
  const textValue = getEmojiTextValue(emoji);
  
  return (
    <TouchableOpacity onPress={() => onPress(option)}>
      <View>
        <View
          style={[
            { borderRadius: 100, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 },
            selected && { borderColor: '#1d71b8', borderWidth: 2, width: 150 },
          ]}
        >
          <Text
            style={[
              { fontSize: 30, padding: 5 },
              selected && { color: '#1d71b8' },
            ]}
          >
            {option}
          </Text>
          
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default EmojiQuestion;