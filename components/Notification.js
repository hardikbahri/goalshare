// Notification.js
import * as Notifications from 'expo-notifications';

const scheduleNotification = async (newGoalTitle, selectedFrequency) => {
  console.log('Scheduling notification...');
  console.log('in notification.js freq ', selectedFrequency);

  // Set up notification content
  const notificationContent = {
    title: 'Reminder',
    body: `Don't forget about your goal: ${newGoalTitle}`,
    sound: true,
  };

  // Calculate the interval in seconds based on the selected frequency
  let intervalInSeconds = 2 * 60 * 60; // Default value (2 hours)

  if (selectedFrequency === '4 hours') {
    intervalInSeconds = 4 * 60 * 60; // 4 hours in seconds
  } else if (selectedFrequency === '6 hours') {
    intervalInSeconds = 6 * 60 * 60; // 6 hours in seconds
  }
// Calculate the number of repetitions until midnight
const now = new Date();
const midnight = new Date(now);
midnight.setHours(24, 0, 0, 0);

timeUntilMidnight = midnight.getTime() - now.getTime();
timeUntilMidnight=Math.ceil(timeUntilMidnight/1000);
console.log(timeUntilMidnight / intervalInSeconds);
const repetitions = Math.ceil(timeUntilMidnight / intervalInSeconds)-1;
console.log("reps",repetitions);

  // Schedule the notification with an explicit trigger type
  await Notifications.scheduleNotificationAsync({
    content: notificationContent,
    trigger: {
      seconds: intervalInSeconds,
      repeats: true,
      
    },
    repeat: repetitions,
  });

  console.log('Notification scheduled successfully');
};


const handleNotification = (notification) => {
  console.log('Received notification:', notification);
  // Handle the notification as needed
};

export { scheduleNotification, handleNotification };
