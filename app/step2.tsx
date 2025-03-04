import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './components/Header';

export default function Step2Page() {
  const router = useRouter();
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('1234');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      const savedPassword = await AsyncStorage.getItem('password');

      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      if (savedPassword) setPassword(savedPassword);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveToLocalStorage = async (newPwd) => {
    try {
      await AsyncStorage.setItem('password', newPwd);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // SMS Commands
  const sendSMS = (command) => {
    const smsUrl = Platform.select({
      ios: `sms:${unitNumber}&body=${encodeURIComponent(command)}`,
      android: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
      default: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
    });
    
    Linking.canOpenURL(smsUrl)
      .then(supported => {
        if (!supported) {
          alert('SMS is not available on this device');
          return;
        }
        return Linking.openURL(smsUrl);
      })
      .catch(err => console.error('An error occurred', err));
  };

  // Change Password
  const changePassword = () => {
    if (!newPassword || newPassword.length !== 4 || !/^\d+$/.test(newPassword)) {
      alert('Password must be 4 digits');
      return;
    }
    sendSMS(`${password}P${newPassword}`);
    setPassword(newPassword);
    setNewPassword('');
    saveToLocalStorage(newPassword);
  };

  return (
    <View style={styles.container}>
      <Header title="Step 2: Change Password" showBack backTo="/setup" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Change Admin Password</Text>
          <Text style={styles.cardSubtitle}>Change the 4-digit password for the GSM relay.</Text>

          <Text style={styles.inputLabel}>Current Password</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={password}
            editable={false}
          />

          <Text style={styles.inputLabel}>New Password (4 digits)</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={(text) => {
              // Only allow 4 digits
              const filtered = text.replace(/[^0-9]/g, '').slice(0, 4);
              setNewPassword(filtered);
            }}
            placeholder="Enter new 4-digit password"
            keyboardType="number-pad"
            maxLength={4}
          />

          <View style={styles.commandBox}>
            <Text style={styles.commandBoxTitle}>Command Format:</Text>
            <Text style={styles.commandSyntax}>pwdPnewpwd</Text>
            <Text style={styles.commandExample}>Example: 1234P6666</Text>
            <Text style={styles.commandExample}>This changes the password to 6666</Text>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={changePassword}
          >
            <Text style={styles.primaryButtonText}>Change Password</Text>
          </TouchableOpacity>
          <Text style={styles.commandPreview}>
            Will send: {password}P{newPassword || "xxxx"}
          </Text>
        </View>
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
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
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
  disabledInput: {
    backgroundColor: '#f5f5f5',
  },
  commandBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  commandBoxTitle: {
    fontWeight: '600',
    marginBottom: 4,
  },
  commandSyntax: {
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  commandExample: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
  commandPreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
});