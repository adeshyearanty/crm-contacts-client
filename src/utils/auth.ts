'use client';

import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const setAuthToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 }); // Token expires in 7 days
};

export const getAuthToken = () => {
  return Cookies.get('access_token');
};

export const removeAuthToken = () => {
  Cookies.remove('access_token');
};

export const isAuthenticated = () => {
  return !!getAuthToken();
};