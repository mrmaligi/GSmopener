import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  backTo?: string;
  color?: string;
}

export default function Header({ title, showBack = false, backTo = '/setup', color = '#FFCC00' }: HeaderProps) {
  const router = useRouter();
  
  return (
    <View style={[styles.header, { backgroundColor: color }]}>
      {showBack && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push(backTo)}
        >
          <ArrowLeft color="white" size={24} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 50, // Extra padding for status bar
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: '400',
    flex: 1,
    textAlign: 'center',
  },
});
