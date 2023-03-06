import React, { useState } from 'react';
import { Button, Share } from 'react-native';
import { getAnswers } from './db';

export default function ShareAnswers() {
  const [exporting, setExporting] = useState(false);

  const handlePress = async () => {
    try {
      setExporting(true);
        const answers = await getAnswers();
        console.log('Answers:', answers); 
        
        const csvData = Object.values(answers).map(answer => {
          const { questionId, answer: ans, dateAnswered, timestamp, remark } = answer;
          return `${timestamp},${questionId},"${ans}","${dateAnswered}","${remark}"`;
        }).join('\n');

      const result = await Share.share({
        message: csvData,
        title: 'My answers',
        type: 'text/csv',
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
    <Button
      title={exporting ? 'Exporting...' : 'Export data'}
      onPress={handlePress}
      disabled={exporting}
    />
  );
}