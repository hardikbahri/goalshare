// ReminderComponent.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const ReminderComponent = ({ selectedFrequency, onFrequencyChange }) => {
  const frequencies = ['2 hours', '4 hours', '6 hours'];

  const handleFrequencyChange = (frequency) => {
    onFrequencyChange(frequency);
  };

  return (
    <View>
      <Text>Select Frequency:</Text>
      {frequencies.map((frequency) => (
        <TouchableOpacity key={frequency} onPress={() => handleFrequencyChange(frequency)}>
          <Text style={{ fontWeight: frequency === selectedFrequency ? 'bold' : 'normal' }}>
            {frequency}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ReminderComponent;
