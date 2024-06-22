
  import React, { useState, useEffect } from 'react';
  import {
    View,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Text,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
  } from 'react-native';
  import ReminderComponent from './ReminderComponent';
  import { useNavigation } from '@react-navigation/native';
  import { scheduleNotification } from './Notification';
  import { useIsFocused } from '@react-navigation/native';

  const NewGoalForm = ({ onAddGoal }) => {
    const [newGoalTitle, setNewGoalTitle] = useState('');

    const [showReminder, setShowReminder] = useState(false);
    const [selectedFrequency, setSelectedFrequency] = useState(2*60*60);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [goals, setGoals] = useState([]);

    useEffect(() => {
    
    }, []);

   

    
    const handleAddGoal = async () => {
      if (newGoalTitle.trim().length === 0) {
        return;
      }
    
      const newGoalId = null;
    
      let notificationId = null;
    
      // Schedule a notification if the reminder is enabled
      if (selectedFrequency != null) {
        console.log(selectedFrequency);
        notificationId = await scheduleNotification(newGoalTitle, selectedFrequency);
      }
    
      const newGoal = {
        id: newGoalId,
        title: newGoalTitle,
        reminder: showReminder,
        frequency: selectedFrequency,
        createdAt: new Date().toISOString(), // Add createdAt property
      };
    
      const updatedGoals = [...goals, newGoal];
      onAddGoal(newGoal);
      setGoals(updatedGoals);
      
      setNewGoalTitle('');
      setSelectedFrequency(2*60*60);
    
      // Navigate to the 'MainScreen' after adding the goal
      navigation.navigate('MainScreen');
    };
    
    
    

    const handleToggleReminder = () => {
      setShowReminder(!showReminder);
    };

    const handleFrequencyChange = (frequency) => {
      setSelectedFrequency(frequency);
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter new goal"
              style={styles.input}
              onChangeText={(text) => setNewGoalTitle(text)}
              value={newGoalTitle || ''}  // Ensure it's not undefined
            />
            <TouchableOpacity onPress={handleToggleReminder}>
              <Text style={styles.toggleReminderButtonText}>
                {showReminder ? 'Hide Reminder' : 'Show Reminder'}
              </Text>
            </TouchableOpacity>
            {showReminder && (
              <ReminderComponent
                selectedFrequency={selectedFrequency}
                onFrequencyChange={handleFrequencyChange}
              />
            )}
            <Button title="Add Goal" onPress={handleAddGoal} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    inputContainer: {
      width: '100%',
      maxWidth: 400,
    },
    input: {
      width: '100%',
      borderBottomColor: '#3498db',
      borderBottomWidth: 2,
      marginBottom: 20,
      fontSize: 18,
      padding: 10,
    },
    toggleReminderButtonText: {
      color: '#3498db',
      fontSize: 16,
      marginBottom: 20,
    },
  });

  export default NewGoalForm;
