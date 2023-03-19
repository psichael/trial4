
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from "react";
import {  Platform } from "react-native";


export default function Notification() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return null;
}

export async function schedulePushNotification(
    className,
    slot,
    type,
    time,
    day,
    notificationTimeInSeconds, // the time of day in seconds
    startDate // the start date for the notification schedule
 ) {
    const endDate = new Date('2023-03-25T00:00:00'); // end date is March 21
    const currentTime = new Date();
     // Calculate the timestamp for the specified time of day
    const timestamp = new Date();
    timestamp.setHours(0, 0, notificationTimeInSeconds, 0);
     // Schedule notifications for each day between start and end dates
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      const notificationDate = new Date(date);
      notificationDate.setHours(timestamp.getHours(), timestamp.getMinutes(), timestamp.getSeconds(), 0);
       // Calculate the delay until the next notification
      const delay = notificationDate.getTime() - currentTime.getTime();
       if (delay > 0) {
        // Schedule the notification
        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Dear Cadet',
            body: 'You have unanswered questions waiting for you',
            // sound: 'default',
          },
          trigger: { seconds: delay / 1000 },
          channelId: 'notifications',
          startDate: startDate,
          endDate: endDate,
        });
         console.log('Notification scheduled for:', notificationDate);
      }
    }
  }
  
  
  

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      sound: true,
      lightColor: '#FF231F7C',
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
    });
  }
  return token;
}
