import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';

const people = [
  {
    name: 'Leslie Alexander',
    email: 'leslie.alexander@example.com',
    role: 'Co-Founder / CEO',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Michael Foster',
    email: 'michael.foster@example.com',
    role: 'Co-Founder / CTO',
    imageUrl:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Dries Vincent',
    email: 'dries.vincent@example.com',
    role: 'Business Relations',
    imageUrl:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
  {
    name: 'Lindsay Walton',
    email: 'lindsay.walton@example.com',
    role: 'Front-end Developer',
    imageUrl:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Courtney Henry',
    email: 'courtney.henry@example.com',
    role: 'Designer',
    imageUrl:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: '3h ago',
    lastSeenDateTime: '2023-01-23T13:23Z',
  },
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    role: 'Director of Product',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    lastSeen: null,
  },
]

const GoalList = ({ goals, habits, onToggleGoal, onDeleteGoal, onEditGoal }) => {
  const allItems = [...goals, ...habits];

  const [selectedGoal, setSelectedGoal] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleToggle = (id) => {
    onToggleGoal(id);
  };

  const handleLongPress = (id) => {
    setSelectedGoal(id);
    setIsModalVisible(true);
  };

  const handleDeleteGoal = () => {
    setIsModalVisible(false);
    onDeleteGoal(selectedGoal);
  };

  const handleEditGoal = () => {
    setIsModalVisible(false);
    onEditGoal(selectedGoal, editedTitle);
    setEditedTitle(''); // Reset editedTitle after editing
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
        
       
  
         
        //}
  
        //scheduleNextDeletion();
      } catch (error) {
        console.error('Error loading goals from storage:', error);
      }
    };
  
    loadGoalsFromStorage();
  
    
  }, []);
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedGoal(null);
    setEditedTitle(''); // Reset editedTitle on modal close
  };

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={styles.goalItem}
      onPress={() => handleToggle(item.id)}
      onLongPress={() => handleLongPress(item.id)}
    >
      <Ionicons
        name={item.completed ? 'checkbox-outline' : 'square-outline'}
        size={24}
        color={item.completed ? '#007AFF' : '#333'}
      />
      <Text style={styles.goalText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const pendingGoals = allItems.filter((item) => !item.completed);
  const completedGoals = allItems.filter((item) => item.completed);

  return (
    
    <View style={styles.container}>
      <Text style={styles.listTitle}>Pending:</Text>
      <FlatList
        data={pendingGoals}
        renderItem={renderGoalItem}
        keyExtractor={(item) =>String(item.id) }
        ListEmptyComponent={<Text>No pending goals</Text>}
      />
      <Text style={styles.listTitle}>Completed:</Text>
      <FlatList
        data={completedGoals}
        renderItem={renderGoalItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text>No completed goals</Text>}
      />

      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Goal</Text>
          {/* Add a TextInput for the new title */}
          <TextInput
            style={styles.input}
            placeholder="Enter new title"
            value={editedTitle}
            onChangeText={(text) => setEditedTitle(text)}
          />

          {/* Add a Button to trigger the edit */}
          <Button title="Save Changes" onPress={handleEditGoal} />

          <TouchableOpacity style={styles.modalItem} onPress={handleDeleteGoal}>
            <Text style={styles.modalText}>Delete Goal</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  goalText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
  modalItem: {
    marginBottom: 15,
  },
  modalText: {
    marginTop: 18,
    fontSize: 18,
    color: 'white',
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  
});

export default GoalList;
