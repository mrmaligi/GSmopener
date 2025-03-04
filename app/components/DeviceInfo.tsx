import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DeviceInfoProps {
  unitNumber: string;
}

export default function DeviceInfo({ unitNumber }: DeviceInfoProps) {
  if (!unitNumber) return null;
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        <Text style={styles.label}>Unit Telephone Number: </Text>
        {unitNumber}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 4,
  },
  label: {
    fontWeight: '400',
  },
});