import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import Header from '../components/Header';
import DeviceInfo from '../components/DeviceInfo';

export default function SetupPage() {
  const router = useRouter();
  const [unitNumber, setUnitNumber] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const savedUnitNumber = await AsyncStorage.getItem('unitNumber');
      if (savedUnitNumber) setUnitNumber(savedUnitNumber);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveToLocalStorage = async () => {
    try {
      await AsyncStorage.setItem('unitNumber', unitNumber);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <View style={styles.container}>
      <Header title="GSM Relay Setup" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Device Configuration</Text>
          <Text style={styles.cardSubtitle}>Follow these steps to set up your GSM relay</Text>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/step1')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>1</Text>
              </View>
              <Text style={styles.menuItemText}>Register Admin Number</Text>
            </View>
            <ArrowLeft style={styles.arrowIcon} size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/step2')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>2</Text>
              </View>
              <Text style={styles.menuItemText}>Change Admin Password</Text>
            </View>
            <ArrowLeft style={styles.arrowIcon} size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/step3')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>3</Text>
              </View>
              <Text style={styles.menuItemText}>Authorized User Management</Text>
            </View>
            <ArrowLeft style={styles.arrowIcon} size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => router.push('/step4')}
          >
            <View style={styles.menuItemContent}>
              <View style={styles.numberCircle}>
                <Text style={styles.numberText}>4</Text>
              </View>
              <Text style={styles.menuItemText}>Relay Control Settings</Text>
            </View>
            <ArrowLeft style={styles.arrowIcon} size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveToLocalStorage}
        >
          <Text style={styles.saveButtonText}>Save All Settings</Text>
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
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#00bfff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    color: 'white',
    fontWeight: '600',
  },
  menuItemText: {
    fontSize: 18,
  },
  arrowIcon: {
    transform: [{ rotate: '180deg' }],
  },
  saveButton: {
    backgroundColor: '#4CAF50',
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