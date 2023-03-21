import React, { useState } from 'react';
import { Button, Share, View } from 'react-native';
import { getAnswers } from './db';

export default function ShareAnswers() {
  const [exporting, setExporting] = useState(false);
  const showButton = new Date() >= new Date(2023, 3, 21); 


  const handlePress = async () => {
    try {
      setExporting(true);
        const answers = await getAnswers();
        console.log('Answers:', answers); 
        
        const csvData = Object.values(answers).map(answer => {
          const { questionId, answer: ans, dateAnswered, timestamp, remark } = answer;
          return `${timestamp},${questionId},"${ans}","${dateAnswered}","${remark}"`;
        }).join('\n');

        const email = 'cadet@hzs.be';
        const messageBody = `Please share by email to: ${email}\n\n${csvData}`;
        const result = await Share.share({
          message: messageBody,
          title: 'My answers',
          type: 'text/csv',
          subject: 'My answers - Exported Data',
        });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Dismissed');
      }
    } catch (error) {
      console.log('Error exporting answers:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={{ marginBottom: 5 }}>
    {showButton && (
      <Button
        title={exporting ? 'Exporting...' : 'Send Answers'}
        onPress={handlePress}
        disabled={exporting}
      />
    )}
  </View>
  
  );
}