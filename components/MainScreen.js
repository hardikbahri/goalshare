import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity ,StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AddOptionsModal from './AddOptionsModal';
import GoalList from './GoalList';
import NewGoalForm from './NewGoalForm';
import NewHabitForm from './NewHabitForm';
import ReminderComponent from './ReminderComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'goals';



const MainScreen = ({ navigation }) => {

  const [modalVisible, setModalVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  const completedGoals = goals.filter((goal) => goal.completed);
  const uncompletedGoals = goals.filter((goal) => !goal.completed);


  const [displayNewGoalForm, setDisplayNewGoalForm] = useState(false);
  const [displayNewHabitForm, setDisplayNewHabitForm] = useState(false);
  
  

  const handleAddPress = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setDisplayNewGoalForm(false);
    setDisplayNewHabitForm(false);
  };


  const handleNewHabitPress = () => {
    setDisplayNewHabitForm(true);
    setDisplayNewGoalForm(false);
    setModalVisible(false);
  };

  const handleNewGoalPress = () => {
    setDisplayNewGoalForm(true);
    setDisplayNewHabitForm(false);
    setModalVisible(false);
  };

  const handleToggleGoal = (goalId) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
    setHabits((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };
  
  const handleAddGoal = async (newGoal, selectedFrequency) => {
    console.log("ng", newGoal.title);
    if (newGoal.title.trim().length === 0) {
      return;
    }
   
    const newGoalId = String(Date.now()); // Use timestamp as the key
    newGoal.id=newGoalId;
  
    let notificationId = null;
  
    // Schedule a notification if the reminder is enabled
    if (selectedFrequency != null) {
      console.log(selectedFrequency);
      notificationId = await scheduleNotification(newGoal.title, selectedFrequency);
    }
  
    const updatedGoals = [...goals, newGoal];
    console.log("t2",goals);
    setGoals(updatedGoals);
    
    try {
      // Use the timestamp as the key when storing the goal in AsyncStorage
      const goalString = JSON.stringify(newGoal);
      await AsyncStorage.setItem(`goal_${newGoalId}`, goalString);
    } catch (error) {
      console.error('Error storing goal in AsyncStorage:', error);
    }
  
  };
  
  
  

  const handleAddHabit = (newHabitTitle) => {
    if (!newHabitTitle || newHabitTitle.trim().length === 0) {
      return;
    }

    const newHabit = {
      id: String(Date.now()), // Use a timestamp as a string for a unique ID
      title: newHabitTitle,
      completed: false,
    };
    
    setHabits((prevHabits) => [...prevHabits, newHabit]);
    setDisplayNewHabitForm(false);
  };
  const scheduleNextDeletion = () => {
    console.log('Scheduling next deletion...');
    const timeUntilDeletion = 1 * 10 * 1000; // 1 minute in milliseconds
  
    setTimeout(() => {
      if(goals.length!=0){
      deleteExpiredItems();}
      else{
        console.log("goals array not set");
      }
      //scheduleNextDeletion(); // Reschedule for the next day
    }, timeUntilDeletion);
   
  };
  
  const onDeleteGoal = (goalId) => {
    console.log(goalId);
    const updatedGoals = goals.filter((goal) => goal.id !== goalId);
    const updatedHabits = habits.filter((habit) => habit.id !== goalId);
    setGoals(updatedGoals);
    setHabits(updatedHabits);
  };
  const handleEditGoal = (editedGoalId, updatedTitle) => {
    console.log('editedGoalId:', editedGoalId);
    console.log('updatedTitle:', updatedTitle);
  
    if (!updatedTitle || updatedTitle.trim().length === 0) {
      console.error('Invalid updated goal title.');
      return;
    }
  
    const updatedGoals = [...goals]; // Create a copy of the goals array
  
    const goalIndex = updatedGoals.findIndex((goal) => goal.id === editedGoalId);
  
    if (goalIndex !== -1) {
      updatedGoals[goalIndex] = { ...updatedGoals[goalIndex], title: updatedTitle };
      setGoals(updatedGoals);
    } else {
      console.error('Goal not found.');
      return;
    }
  
    try {
      
      console.log('Goal updated successfully.');
    } catch (error) {
      console.error('Error updating frequency:', error);
    }
  };
  const deleteExpiredItems =async () => {
    console.log('Deleting expired items...');
    console.log("goals in dei",goals);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStart = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
    // Filter goals created before tomorrow
    const expiredGoals = goals.filter((goal) => {
        const goalDate = new Date(goal.createdAt);
        if (isNaN(goalDate.getTime())) {
            // Log and skip invalid dates
            console.log('Invalid goal date for goal:', goal);
            return false;
        }
        return goalDate < tomorrowStart;
    });
  
    // Log the filtered goals
    console.log('Expired goals:', expiredGoals);
  
    // Create arrays of keys for expired goals with different ID formats
    const expiredGoalKeys = expiredGoals.filter((goal) => goal.id !== null).map((goal) => `goal_${goal.id}`);
    const nullIdGoalKeys = expiredGoals
      .filter((goal) => goal.id === null)
      .map((_, index) => `goal_null_${index}`);
  
    // Combine the arrays of keys
    const allExpiredKeys = [...expiredGoalKeys, ...nullIdGoalKeys];
  
    console.log("exp keys", allExpiredKeys);
  
    // try {
    //   // Wait for AsyncStorage.multiRemove to complete before updating state
    //   await AsyncStorage.multiRemove(allExpiredKeys);
      
  
    //   // Update state with non-expired goals
    //   const nonExpiredGoals = goals.filter((goal) => !expiredGoals.includes(goal));
    //   setGoals(nonExpiredGoals);
  
    //   // Optionally update expiration data if stored separately
  
    //   console.log('Deleted from AsyncStorage:', allExpiredKeys);
    // } catch (error) {
    //   console.error('Error deleting from AsyncStorage:', error);
    // }
};


 
useEffect(() => {
  // let isMounted = true;

  const loadGoalsFromStorage = async () => {
    try {

      const keys = await AsyncStorage.getAllKeys();
      const goalKeys = keys.filter(key => key.startsWith('goal_'));
      console.log('Goal keys:', goalKeys);

      const goalsData = await AsyncStorage.multiGet(goalKeys);
      console.log('Goals data:', goalsData);

      const retrievedGoals = goalsData.map(([key, value]) => JSON.parse(value));
      
      console.log('Retrieved goals:', retrievedGoals);
     
      

      // if (1) {
        setGoals(retrievedGoals);
       console.log("size rg",retrievedGoals.length);
       console.log("size",goals.length);
       console.log("size",goals.length);

       
      //}

      scheduleNextDeletion();
    } catch (error) {
      console.error('Error loading goals from storage:', error);
    }
  };

  loadGoalsFromStorage();

  
}, []);

  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AddOptionsModal
        isVisible={modalVisible}
        onClose={handleCloseModal}
        onNewHabitPress={handleNewHabitPress}
        onNewGoalPress={handleNewGoalPress}
      />

<GoalList goals={goals} habits={habits} onToggleGoal={handleToggleGoal} onDeleteGoal={onDeleteGoal} onEditGoal={handleEditGoal}/>

      {displayNewGoalForm && <NewGoalForm onAddGoal={handleAddGoal} />}
      {displayNewHabitForm && <NewHabitForm onAddHabit={handleAddHabit} />}
      <TouchableOpacity onPress={handleAddPress}>
        <Ionicons name="ios-add-circle-outline" size={64} color="black" />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#3498db', // Use your preferred color
    borderRadius: 32,
    padding: 8,
  },
});

export default MainScreen;
