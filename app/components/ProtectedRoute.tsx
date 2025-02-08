import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Redirect } from 'expo-router';
import React from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <>{children}</>;
} 