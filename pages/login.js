import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, ScrollView, TouchableWithoutFeedback, Image } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/actions';
import PrimaryStyles from '../styles/primaryStyles';
import { useNavigation } from '@react-navigation/native';
import { Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error_message, setError] = useState(null);

    const dispatch = useDispatch();
    const navigation = useNavigation();

    // Валидация
    const validateForm = () => {
        if (!username.trim()) {
            setError("Колдонуучу атын жазыңыз");
            return false;
        }
        if (!password.trim()) {
            setError("Сырсөз жазыңыз");
            return false;
        }
        return true;
    };

    const login = async () => {
        // Валидация
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/auth/login/', {
                username: username.trim(),
                password
            });

            console.log('Login success:', response.data);
            const { token } = response.data;

            if (!token) {
                setError("Сервер катасы: токен жок");
                setLoading(false);
                return;
            }

            // Token сактоо
            if (Platform.OS !== 'web') {
                await SecureStore.setItemAsync("user_token", token);
            }

            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            dispatch(loginAction({ username: username.trim() }));
            navigation.navigate('Inside');

        } catch (error) {
            console.log('Login error:', error);

            // Дароо лоадерди токтотуу
            setLoading(false);

            // Эгер жооп жок болсо - тармак катасы
            if (!error.response) {
                if (error.code === 'ERR_NETWORK') {
                    setError("Интернет байланышы жок");
                } else {
                    setError("Серверге туташуу мүмкүн эмес");
                }
                return;
            }

            // Сервер ката жооп берди
            const status = error.response.status;
            const data = error.response.data;

            console.log('Error status:', status);
            console.log('Error data:', data);

            // Ката маалыматын чыгаруу
            if (status === 400) {
                if (data.non_field_errors) {
                    const msg = data.non_field_errors[0];
                    if (msg.includes('Unable to log in') || msg.includes('credentials')) {
                        setError("Колдонуучу аты же сырсөз туура эмес");
                    } else {
                        setError(msg);
                    }
                } else if (data.username) {
                    setError("Колдонуучу атын жазыңыз");
                } else if (data.password) {
                    setError("Сырсөз жазыңыз");
                } else if (data.detail) {
                    setError(data.detail);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError("Маалыматтар туура эмес");
                }
            } else if (status === 401) {
                setError("Колдонуучу аты же сырсөз туура эмес");
            } else if (status === 500) {
                setError("Сервер катасы. Кийинчерээк аракет кылыңыз");
            } else if (status === 503) {
                setError("Сервер убактылуу иштебей жатат");
            } else {
                setError(`Ката: ${status}`);
            }
            return;
        }

        setLoading(false);
    };

    return (
        <SafeAreaView style={PrimaryStyles.screen_container}>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={PrimaryStyles.centered_stack}
                        keyboardShouldPersistTaps="handled"
                    >
                        <Image
                            source={require('../assets/logo.png')}
                            resizeMode="contain"
                            style={{
                                marginBottom: 40,
                                height: 100,
                                width: 300,
                                alignSelf: 'center',
                            }}
                        />

                        <TextInput
                            placeholder='Колдонуучу аты'
                            value={username}
                            style={PrimaryStyles.input}
                            onChangeText={text => { setUsername(text); setError(null); }}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        <TextInput
                            placeholder='Сырсөз'
                            value={password}
                            style={PrimaryStyles.input}
                            secureTextEntry
                            onChangeText={text => { setPassword(text); setError(null); }}
                        />

                        {error_message && (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color="#ff4757" />
                                <Text style={styles.errorText}>{error_message}</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={login}
                            disabled={loading}
                            style={[PrimaryStyles.button, (loading ? { opacity: 0.7 } : {})]}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="white" style={{ margin: 10 }} />
                            ) : (
                                <Text style={PrimaryStyles.button_text}>Кирүү</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('CreateAccount')} disabled={loading}>
                            <Text style={PrimaryStyles.button_text}>Жаңы аккаунт түзүү</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 71, 87, 0.1)',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
    },
    errorText: {
        color: '#ff4757',
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
    },
});

export default LoginScreen;
