import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';

export default function SettingsPage() {
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('1234');
  const [relaySettings, setRelaySettings] = useState({
    accessControl: 'AUT',
    latchTime: '000',
  });

  useEffect(() => {
    loadData();
    if (!unitNumber) {
      setUnitNumber('+1234567890'); // Temporary test number
      AsyncStorage.setItem('unitNumber', '+1234567890');
    }
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      const savedPassword = await AsyncStorage.getItem('password');
      const savedRelaySettings = await AsyncStorage.getItem('relaySettings');

      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      if (savedPassword) setPassword(savedPassword);
      if (savedRelaySettings) setRelaySettings(JSON.parse(savedRelaySettings));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveToLocalStorage = async () => {
    try {
      await AsyncStorage.setItem('unitNumber', unitNumber);
      await AsyncStorage.setItem('password', password);
      await AsyncStorage.setItem('relaySettings', JSON.stringify(relaySettings));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SMS Command Reference</Text>
          <View style={styles.commandList}>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 1:</Text> {password}TEL00xxxxxxxxxx#
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 2:</Text> {password}P[new 4-digit password]
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 3.1:</Text> {password}A[serial]#[phone]#
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 3.2:</Text> {password}A[serial]#[phone]#[start]#[end]#
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 3.3:</Text> {password}A[serial]##
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 4.1:</Text> {password}ALL#
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 4.2:</Text> {password}AUT#
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 4.3:</Text> {password}GOT[time]#
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 5 ON:</Text> {password}CC
            </Text>
            <Text style={styles.commandItem}>
              <Text style={styles.commandLabel}>Step 5 OFF:</Text> {password}DD
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Settings</Text>
          
          <Text style={styles.inputLabel}>Unit Telephone Number</Text>
          <TextInput
            style={styles.input}
            value={unitNumber}
            onChangeText={setUnitNumber}
            placeholder="Enter GSM relay number"
            keyboardType="phone-pad"
          />
          
          <Text style={styles.inputLabel}>Current Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(text) => {
              // Only allow 4 digits
              const filtered = text.replace(/[^0-9]/g, '').slice(0, 4);
              setPassword(filtered);
            }}
            placeholder="4-digit password"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveToLocalStorage}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  commandList: {
    marginBottom: 8,
  },
  commandItem: {
    fontSize: 16,
    marginBottom: 8,
  },
  commandLabel: {
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
