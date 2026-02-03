import React from 'react';
import { useEffect } from 'react';
import 'react-native-gesture-handler';
import MainRouter from './navigation/MainRouter';
import { Provider } from 'react-redux';
import store from './store';
import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import NavigationBarColor from 'react-native-navigation-bar-color';
import { BACKEND_URL, API_TIMEOUT } from '@env';

// Fallback URL for production builds when .env is not available
const PRODUCTION_BACKEND_URL = 'https://popoffbackend.onrender.com/api';

export default function App() {

  //NavigationBarColor('#000000', true); // black color, light icons

  useEffect(() => {
    // Backend URL .env файлдан алынат, же production fallback
    axios.defaults.baseURL = BACKEND_URL || PRODUCTION_BACKEND_URL;

    console.log('Backend URL:', axios.defaults.baseURL);
    // Render.com cold start үчүн 30 секунд timeout
    axios.defaults.timeout = API_TIMEOUT ? parseInt(API_TIMEOUT) : 30000;
    axios.defaults.headers.common['content-type'] = 'multipart/form-data';
  }, []);

  return (
    <Provider store={store}>
      <MainRouter/>
    </Provider>
  );
}
