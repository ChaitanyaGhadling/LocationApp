import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    const handleLogin = async() => {
        //navigation.navigate('Home');
        try{
            const response = await axios.post('http://192.168.1.161:3000/auth/login', {
                email: email,
                password: password
            });
            console.log('handlelogin called');  
        if (response.data.success) {
            navigation.navigate('Home', {email,});
            console.log('Login successful');
        } else {
            Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
        }
    } catch (error) {
        // Handle API call error
        console.error(error);
    }
    };
    const handleRegister = () => {
        navigation.navigate('Register');
    };

  return (
    <KeyboardAvoidingView 
    style = {styles.container}
    behaviour="padding">
    <View style={styles.inputContainer}>
        <TextInput 
        placeholder = "Email"
        value = { email }
        onChangeText={text=> setEmail(text)}
        style = {styles.input}>
        </TextInput>
        <TextInput 
        placeholder = "Password"
        value = { password }
        onChangeText={text=> setPassword(text)}
        style = {styles.input}
        secureTextEntry>
        </TextInput>
    </View>
    <View
    style={styles.buttonContainer}>
        <TouchableOpacity
            onPress={handleLogin}
            style = {styles.button}>
            <Text style={styles.buttonText}>
                Login
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
            onPress={handleRegister}
            style = {[styles.button, styles.buttonOutline]}>
            <Text style={styles.buttonOutlineText}>
                Register
            </Text>
        </TouchableOpacity>
    
    </View>    
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    },
    buttonOutlineText : {
        color:'#0782F9',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline : {
        backgroundColor:'white',
        marginTop:5,
        borderColor: '#0782F9',
        borderWidth: 2,

    },
    button: {
        backgroundColor:'#0782F9',
        width:'100%',
        padding:15,
        borderRadius:10,
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'centre',
        alignItems: 'center',
        marginTop:40,

    },
    inputContainer: {
        width : '80%'
    },
    input: {
        backgroundColor: 'white',
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius:5,
        marginTop:5,
    },
    buttonText : {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
})