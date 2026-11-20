'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, setUnauthorizedHandler, tokenStore } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | authenticated | unauthenticated

  const logout = useCallback(() => {
    tokenStore.clear();
    queryClient.clear();
    setUser(null);
    setStatus('unauthenticated');
  }, [queryClient]);

  // Restore the session from the saved token on first load.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    if (!tokenStore.get()) {
      setStatus('unauthenticated');
      return;
    }
    api
      .get('/auth/me')
      .then(({ user: me }) => {
        setUser(me);
        setStatus('authenticated');
      })
      .catch(() => logout());
  }, [logout]);

  const authenticate = useCallback(
    (data) => {
      tokenStore.set(data.token);
      queryClient.clear();
      setUser(data.user);
      setStatus('authenticated');
    },
    [queryClient]
  );

  const login = useCallback(
    async (credentials) => authenticate(await api.post('/auth/login', credentials, { skipAuthRedirect: true })),
    [authenticate]
  );

  const register = useCallback(
    async (payload) => authenticate(await api.post('/auth/register', payload, { skipAuthRedirect: true })),
    [authenticate]
  );

  const value = useMemo(
    () => ({ user, status, login, register, logout }),
    [user, status, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
