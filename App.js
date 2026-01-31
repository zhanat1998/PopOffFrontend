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

export default function App() {

  //NavigationBarColor('#000000', true); // black color, light icons

  useEffect(() => {
    // Backend URL .env файлдан алынат
    axios.defaults.baseURL = BACKEND_URL;

    console.log('Backend URL (.env):', axios.defaults.baseURL);
    axios.defaults.timeout = API_TIMEOUT ? parseInt(API_TIMEOUT) : 10000;
    axios.defaults.headers.common['content-type'] = 'multipart/form-data';
  }, []);

  return (
    <Provider store={store}>
      <MainRouter/>
    </Provider>
  );
}
