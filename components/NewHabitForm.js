import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const NewHabitForm = ({ onAddHabit }) => {
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const handleAddHabit = () => {
    if (newHabitTitle.trim().length === 0) {
      return; // Don't add empty habits
    }
    onAddHabit(newHabitTitle); // Pass the entered habit title to the parent component
    setNewHabitTitle(''); // Clear the input after adding the habit
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        placeholder="Enter new habit"
        style={styles.input}
        onChangeText={(text) => setNewHabitTitle(text)} // Update the newHabitTitle state
        value={newHabitTitle}
      />
      <Button title="Add Habit" onPress={handleAddHabit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    width: '100%',
    borderBottomColor: '#3498db',
    borderBottomWidth: 2,
    marginBottom: 20,
    fontSize: 18,
    padding: 10,
  },
  toggleReminderButton: {
    marginBottom: 20,
  },
  toggleReminderButtonText: {
    color: '#3498db',
    fontSize: 16,
  },
});

export default NewHabitForm;
