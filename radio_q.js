import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity} from 'react-native';



function RadioQuestion({ question, onSaveAnswer }) {
  const [answer, setAnswer] = useState(null);
  
  const handlePress = async (option) => {
    setAnswer(option);
    
  };

  const handleSave = async () => {
    await onSaveAnswer(question.questionId, answer);
  };


  return (
    <View>
      <Text style={{ fontSize: 20, fontWeight: 'bold', padding: 10, color: '#1d71b8' }}>{question.questionText}</Text>
      {question.radioOptions.map((option) => (
          <RadioOption
            key={option}
            option={option}
            onPress={handlePress}
            selected={answer === option}
            />
        ))}
      <View style={{padding: 30} }>
        <Button title="Next question" onPress={handleSave} color="#1d71b8" />
      </View>
      
    </View>
  );
}

function RadioOption({ option, onPress, selected }) {
  return (
    <TouchableOpacity onPress={() => onPress(option)}>

        
      <View
        style={[
          { borderRadius: 100, backgroundColor: '#fff' },
          selected && { borderColor: '#1d71b8', borderWidth: 2 },
        ]}
      >
        <Text
          style={[
            { fontSize: 20, padding: 10 },
            selected && { color: '#1d71b8' },
          ]}
        >
          {option.substring(0, 500)}
        </Text>
      </View>
        

    </TouchableOpacity>
  );
}

export default RadioQuestion;