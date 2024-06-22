import React, { useState } from 'react';
import { View, TouchableOpacity, Text ,StyleSheet} from 'react-native';
// import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Modal from 'react-native-modal';

const AddOptionsModal = ({ isVisible, onNewHabitPress, onNewGoalPress }) => {
  const closeModal = () => {
    // Handle modal visibility directly using state
    setIsVisible(false);
  };

  return (
    <Modal
      onBackdropPress={closeModal}
      animationType="slide"
      transparent={true}
      visible={isVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.optionButton} onPress={onNewHabitPress}>
            <Text style={styles.optionText}>Create New Habit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionButton} onPress={onNewGoalPress}>
            <Text style={styles.optionText}>Create New Goal</Text>
          </TouchableOpacity>
          {/* Add other options/buttons as needed */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Fully transparent background
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  optionButton: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddOptionsModal;
