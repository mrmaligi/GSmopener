import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Users, Lock } from 'lucide-react-native';
import Header from './components/Header';

export default function Step4Page() {
  const router = useRouter();
  const [unitNumber, setUnitNumber] = useState('');
  const [password, setPassword] = useState('1234');
  const [relaySettings, setRelaySettings] = useState({
    accessControl: 'AUT',
    latchTime: '000',
  });

  useEffect(() => {
    loadData();
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
      await AsyncStorage.setItem('relaySettings', JSON.stringify(relaySettings));
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

  // Relay Control Settings
  const setAccessControl = (type) => {
    const command = type === 'ALL' ? `${password}ALL#` : `${password}AUT#`;
    sendSMS(command);
    setRelaySettings({ ...relaySettings, accessControl: type });
    saveToLocalStorage();
  };

  const setLatchTime = () => {
    const latchTime = relaySettings.latchTime.padStart(3, '0');
    sendSMS(`${password}GOT${latchTime}#`);
    saveToLocalStorage();
  };

  return (
    <View style={styles.container}>
      <Header title="Step 4: Relay Settings" showBack backTo="/setup" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Relay Control Settings</Text>

          <Text style={styles.sectionTitle}>Access Control</Text>
          <View style={styles.optionsGrid}>
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                relaySettings.accessControl === 'ALL' && styles.optionButtonSelected
              ]}
              onPress={() => setAccessControl('ALL')}
            >
              <Users size={32} color="#00bfff" style={styles.optionIcon} />
              <Text style={styles.optionText}>Allow All Numbers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.optionButton, 
                relaySettings.accessControl === 'AUT' && styles.optionButtonSelected
              ]}
              onPress={() => setAccessControl('AUT')}
            >
              <Lock size={32} color="#00bfff" style={styles.optionIcon} />
              <Text style={styles.optionText}>Authorized Only</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.commandPreview}>
            Will send: {password}
            {relaySettings.accessControl === 'ALL' ? 'ALL#' : 'AUT#'}
          </Text>

          <Text style={styles.sectionTitle}>Relay Latch Time</Text>
          <Text style={styles.inputLabel}>Latch Time (000-999 seconds)</Text>
          <TextInput
            style={styles.input}
            value={String(parseInt(relaySettings.latchTime) || '0')}
            onChangeText={(text) => {
              const value = Math.min(999, Math.max(0, parseInt(text) || 0));
              setRelaySettings({ 
                ...relaySettings, 
                latchTime: value.toString().padStart(3, '0') 
              });
            }}
            keyboardType="number-pad"
            maxLength={3}
          />
          <Text style={styles.inputHint}>
            000 = Momentary (0.5s), 999 = Always ON until next call
          </Text>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={setLatchTime}
          >
            <Text style={styles.primaryButtonText}>Set Latch Time</Text>
          </TouchableOpacity>
          <Text style={styles.commandPreview}>
            Will send: {password}GOT{relaySettings.latchTime}#
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
  },
  optionButtonSelected: {
    borderColor: '#00bfff',
    backgroundColor: '#e6f7ff',
  },
  optionIcon: {
    marginBottom: 8,
  },
  optionText: {
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
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
    marginBottom: 16,
  },
});
