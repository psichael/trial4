import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

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
      <KeyboardAvoidingView behavior="position">
        <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#007AFF' }}>{question.questionText}</Text>
        {question.answerType === 'smilies' &&
          question.radioOptions.map((option) => (
            <SmileyOption
              key={option}
              option={option}
              onPress={handlePress}
              selected={answer === option}
              />
          ))}
        
        
        <View style={{marginTop:20}}>
          
            <Text>Remark:</Text>
              <TextInput
                placeholder= "Only if you feel the need" 
                style={{ height: 40, borderColor: '#007AFF', borderWidth: 1, marginBottom: 10, padding: 10, borderRadius: 5}}
                value={remark}
                onChangeText={handleTextChange}
                onSubmitEditing={handleTextChange}
              />
          
          
        </View>
        <View style={{padding: 30}}>
          <Button title="Next question" onPress={handleSave} />
        </View>      
      </KeyboardAvoidingView>
    </View>
  );
}

function SmileyOption({ option, onPress, selected }) {
  return (
    <TouchableOpacity onPress={() => onPress(option)}>
      <View
        // style={[
        //   {  flexDirection: 'row', alignItems: 'center' },
        //   selected && { backgroundColor: '#B0E0E6', borderRadius: 100 },
        // ]}
      >
        <View
          style={[
            { borderRadius: 100, backgroundColor: '#fff' },
            selected && { borderColor: '#007AFF', borderWidth: 2, width: 53 },
          ]}
        >
          <Text
            style={[
              { fontSize: 30, padding: 5 },
              selected && { color: '#007AFF' },
            ]}
          >
            {option.substring(0, 2)}
          </Text>
        </View>
        <Text style={{ fontSize: 14 }}>{option.substring(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default EmojiQuestion;