import React, { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/home" />;
}