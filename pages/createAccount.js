import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from '../store/actions';
import PrimaryStyles from '../styles/primaryStyles';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView } from 'react-native';
import { Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const RegisterScreen = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [agreed, setAgreed] = useState(false);

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
        if (username.length < 3) {
            setError("Колдонуучу аты 3 символдон көп болуш керек");
            return false;
        }
        if (!email.trim()) {
            setError("Email жазыңыз");
            return false;
        }
        if (!email.includes('@') || !email.includes('.')) {
            setError("Туура email жазыңыз");
            return false;
        }
        if (!password.trim()) {
            setError("Сырсөз жазыңыз");
            return false;
        }
        if (password.length < 6) {
            setError("Сырсөз 6 символдон көп болуш керек");
            return false;
        }
        if (!agreed) {
            setError("Шарттарды кабыл алыңыз");
            return false;
        }
        return true;
    };

    const createAccount = async () => {
        // Валидация
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/auth/register/', {
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password,
                phone_number: phoneNumber
            });

            console.log('Register success:', response.data);
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
            navigation.navigate("Inside");

        } catch (error) {
            console.log('Register error:', error);

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

            // Backend'ден келген катаны түз көрсөтүү
            if (status === 400) {
                // Backend кыргызча жооп берет
                if (data.username) {
                    setError(data.username[0]);
                } else if (data.email) {
                    setError(data.email[0]);
                } else if (data.password) {
                    setError(data.password[0]);
                } else if (data.non_field_errors) {
                    setError(data.non_field_errors[0]);
                } else if (data.detail) {
                    setError(data.detail);
                } else if (data.error) {
                    setError(data.error);
                } else {
                    setError("Маалыматтарды текшериңиз");
                }
            } else if (status === 500) {
                setError("Сервер катасы");
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
        <SafeAreaView style={[PrimaryStyles.screen_container, {justifyContent: 'center', alignItems: 'center'}]}>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={[PrimaryStyles.centered_stack,{justifyContent: 'center', alignItems: 'center', width: '90%'}]}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>

                {/*input fields*/}
                <TextInput
                    placeholder='Колдонуучу аты'
                    value={username}
                    style={PrimaryStyles.input}
                    onChangeText={text => { setUsername(text); setError(null); }}
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    placeholder='Email'
                    value={email}
                    style={PrimaryStyles.input}
                    onChangeText={text => { setEmail(text); setError(null); }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TextInput
                    placeholder='Телефон номери (милдеттүү эмес)'
                    value={phoneNumber}
                    style={PrimaryStyles.input}
                    onChangeText={text => { setPhoneNumber(text); setError(null); }}
                    inputMode='numeric'
                    keyboardType='numeric'
                />
                <TextInput
                    placeholder='Сырсөз (6+ символ)'
                    value={password}
                    style={PrimaryStyles.input}
                    secureTextEntry={true}
                    onChangeText={text => { setPassword(text); setError(null); }}
                />

                {/* Terms of Service Checkbox */}
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}
                    onPress={() => { setAgreed(!agreed); setError(null); }}
                    disabled={loading}
                >
                    <View style={{
                        width: 24, height: 24, borderWidth: 2, borderColor: '#ccc', borderRadius: 6, marginRight: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: agreed ? 'rgb(255,36,83)' : 'white'
                    }}>
                        {agreed && <Ionicons name="checkmark" size={18} color="white" />}
                    </View>
                    <Text style={{ color: 'white', flex: 1, flexWrap: 'wrap' }}>
                        Мен{' '}
                        <Text style={{ color: 'rgb(255, 36, 83)', textDecorationLine: 'underline' }} onPress={() => {
                            Linking.openURL('https://alder-phlox-1e6.notion.site/PopOff-Terms-of-Service-1f95bd204ac180049762d7257a6880c0');
                        }}>
                            Колдонуу шарттарын
                        </Text>
                        {' '}жана{' '}
                        <Text style={{ color: 'rgb(255, 36, 83)', textDecorationLine: 'underline' }} onPress={() => {
                            Linking.openURL('https://alder-phlox-1e6.notion.site/Privacy-Policy-1f65bd204ac18055ad65db63b46b677a');
                        }}>
                            Купуялык саясатын
                        </Text>
                        {' '}кабыл алам
                    </Text>
                </TouchableOpacity>

                {error_message && (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={20} color="#ff4757" />
                        <Text style={styles.errorText}>{error_message}</Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={createAccount}
                    disabled={loading}
                    style={[PrimaryStyles.button, (loading ? { opacity: 0.7 } : {})]}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="white" style={{ margin: 10 }} />
                    ) : (
                        <Text style={PrimaryStyles.button_text}>Катталуу</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
                    <Text style={PrimaryStyles.button_text}>Аккаунтум бар</Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
            </TouchableWithoutFeedback>

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

export default RegisterScreen;
