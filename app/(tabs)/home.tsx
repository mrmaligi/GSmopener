import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, PermissionsAndroid } from 'react-native';
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
    if (Platform.OS === 'android') {
      requestAndroidPermissions();
    }
    loadData();
  }, []);

  const requestAndroidPermissions = async () => {
    try {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ];
      const result = await PermissionsAndroid.requestMultiple(permissions);
      console.log('Permission results:', result);
      // Optionally, you could check if any permission is denied and handle accordingly.
    } catch (err) {
      console.warn('Permission request error:', err);
    }
  };

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

    // For iOS, remove '+' if present.
    const formattedUnitNumber = Platform.OS === 'ios' ? unitNumber.replace('+', '') : unitNumber;

    const smsUrl = Platform.select({
      ios: `sms:${formattedUnitNumber}&body=${encodeURIComponent(command)}`,
      android: `sms:${formattedUnitNumber}?body=${encodeURIComponent(command)}`,
      default: `sms:${formattedUnitNumber}?body=${encodeURIComponent(command)}`,
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

  // Control Relay
  const turnRelayOn = () => sendSMS(`${password}CC`);
  const turnRelayOff = () => sendSMS(`${password}DD`);

  return (
    <View style={styles.container}>
      <Header title="connect4v" />
      <DeviceInfo unitNumber={unitNumber} />
      
      <View style={styles.content}>
        <View style={styles.card}>
          <TouchableOpacity style={styles.button} onPress={turnRelayOn}>
            <View style={styles.buttonContent}>
              <Gate size={48} color="#FFCC00" />
              <Text style={styles.buttonText}>Open Gate (ON)</Text>
            </View>
            <MessageSquare size={24} color="#FFCC00" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={turnRelayOff}>
            <View style={styles.buttonContent}>
              <Gate size={48} color="#FFCC00" />
              <Text style={styles.buttonText}>Close Gate (OFF)</Text>
            </View>
            <MessageSquare size={24} color="#FFCC00" />
          </TouchableOpacity>
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
    borderColor: '#FFCC00',
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
    backgroundColor: '#FFCC00',
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
