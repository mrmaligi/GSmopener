import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageSquare } from 'lucide-react-native';
import { Gate } from '../components/CustomIcons';
import Header from '../components/Header';
import DeviceInfo from '../components/DeviceInfo';

export default function HomePage() {
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
      console.log('Loaded unitNumber:', savedUnitNumber); // Add this line
      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
      else console.warn('No unitNumber found in AsyncStorage');
      const savedPassword = await AsyncStorage.getItem('password');
      const savedRelaySettings = await AsyncStorage.getItem('relaySettings');

      if (savedPassword) setPassword(savedPassword);
      if (savedRelaySettings) setRelaySettings(JSON.parse(savedRelaySettings));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // SMS Commands
  const sendSMS = (command) => {
    if (!unitNumber) {
      alert('Please set a valid unit number in Settings.');
      return;
    }

    const smsUrl = Platform.select({
      ios: `sms:${unitNumber.replace('+', '')}&body=${encodeURIComponent(command)}`,
      android: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
      default: `sms:${unitNumber}?body=${encodeURIComponent(command)}`,
    });

    console.log('SMS URL:', smsUrl);

    Linking.canOpenURL(smsUrl)
      .then((supported) => {
        if (!supported) {
          alert('SMS is not available on this device. Please ensure an SMS app is installed.');
          return;
        }
        return Linking.openURL(smsUrl);
      })
      .catch((err) => {
        console.error('An error occurred while opening SMS:', err);
        alert('Failed to open SMS. Check the console for details.');
      });
  };

  // Call Device
  const callDevice = () => {
    if (!unitNumber) {
      alert('Please set a valid unit number in Settings.');
      return;
    }

    const phoneUrl = `tel:${unitNumber}`;

    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (!supported) {
          alert('Phone call is not available on this device.');
          return;
        }
        return Linking.openURL(phoneUrl);
      })
      .catch((err) => {
        console.error('An error occurred while making a phone call:', err);
        alert('Failed to make a phone call. Check the console for details.');
      });
  };

  // Control Relay
  const turnRelayOn = () => {
    sendSMS(`${password}CC`);
    callDevice();
  };
  const turnRelayOff = () => {
    sendSMS(`${password}DD`);
    callDevice();
  };

  return (
    <View style={styles.container}>
      <Header title="GSM Relay Control" />
      <DeviceInfo unitNumber={unitNumber} />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Step 5: Control the relay ON / OFF</Text>
          <Text style={styles.cardSubtitle}>Control the gate by sending SMS commands</Text>

          <TouchableOpacity style={styles.button} onPress={turnRelayOn}>
            <View style={styles.buttonContent}>
              <Gate size={48} color="#00bfff" />
              <Text style={styles.buttonText}>Open Gate (ON)</Text>
            </View>
            <MessageSquare size={24} color="#00bfff" />
          </TouchableOpacity>
          <Text style={styles.commandText}>Sends: "{password}CC" - Return SMS: Relay ON</Text>

          <TouchableOpacity style={styles.button} onPress={turnRelayOff}>
            <View style={styles.buttonContent}>
              <Gate size={48} color="#00bfff" />
              <Text style={styles.buttonText}>Close Gate (OFF)</Text>
            </View>
            <MessageSquare size={24} color="#00bfff" />
          </TouchableOpacity>
          <Text style={styles.commandText}>Sends: "{password}DD" - Return SMS: Relay OFF</Text>

          <TouchableOpacity style={styles.button} onPress={callDevice}>
            <View style={styles.buttonContent}>
              <Gate size={48} color="#00bfff" />
              <Text style={styles.buttonText}>Call Device</Text>
            </View>
            <MessageSquare size={24} color="#00bfff" />
          </TouchableOpacity>
          <Text style={styles.commandText}>Calls: "{unitNumber}"</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Settings</Text>
          <Text style={styles.settingText}>
            Access Control: {relaySettings.accessControl === "AUT" ? "Authorized Numbers Only" : "All Numbers"}
          </Text>
          <Text style={styles.settingText}>
            Latch Time:{" "}
            {relaySettings.latchTime === "000"
              ? "Momentary (0.5s)"
              : `${parseInt(relaySettings.latchTime)} seconds`}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Setup</Text>
          <Text style={styles.cardSubtitle}>Configure your GSM relay module</Text>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => router.push('/setup')}
          >
            <Text style={styles.primaryButtonText}>Go to Setup</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  button: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 16,
  },
  commandText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  settingText: {
    fontSize: 18,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#00bfff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
