import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Header from './components/Header';

export default function Step3Page() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Header title="Step 3: Authorized Users" showBack backTo="/setup" />
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authorized User Management</Text>
          <Text style={styles.cardSubtitle}>
            The Authorized Number means the one who can dial the device to control the relay.
          </Text>
          <Text style={styles.cardSubtitle}>
            The Serial Number is the position to store the authorized users, from 001~200.
          </Text>

          <View style={styles.commandBox}>
            <Text style={styles.commandExample}>
              "A" command code for adding users followed by their serial number.
            </Text>
            <Text style={styles.commandExample}>
              This sets phone number 123456 at position 16, with access from Aug 5th 8:00AM till Sep 5th 10:00AM.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push('/authorized-users')}
          >
            <Text style={styles.primaryButtonText}>Manage Authorized Users</Text>
          </TouchableOpacity>
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
    marginBottom: 8,
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
  marginTop: {
    marginTop: 12,
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
});
