import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { PostWithoutAuth } from '../service/HttpService';
import { validate } from '../validation/Validation';

import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });


    const handleButton = async () => {
        const validationErrors = validate({ email, password });
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            body = {
                "email": email,
                "password": password
            }
            var response = await PostWithoutAuth("/api/users/login", body);
            if (response.status === 200) {
                console.log("User logged in successfully");
                 await AsyncStorage.setItem('token', response.data["token"]);
                 await AsyncStorage.setItem('currentId', response.data["id"]);
                 await AsyncStorage.setItem('name', response.data["name"]);
                console.log("token:", await AsyncStorage.getItem('token'));
                console.log("currentId:",await AsyncStorage.getItem('currentId'));
                setEmail('');
                setPassword('');
                navigation.navigate('Home');
            } else if(response.status === 401){
                setErrors({password: 'Password is incorrect'});
            }else if(response.status === 404){
                setErrors({email: 'User not exist'});
            }
        }
    }

    return (
        <View className="bg-white h-full w-full">
            <StatusBar style="light" />
            <Image className="h-full w-full absolute" source={require('../../assets/images/background.png')} />

            {/* lights */}
            <View className="flex-row justify-around w-full absolute">
                <Animated.Image
                    entering={FadeInUp.delay(200).duration(1000).springify()}
                    source={require('../../assets/images/light.png')}
                    className="h-[225] w-[90]"
                />
                <Animated.Image
                    entering={FadeInUp.delay(400).duration(1000).springify()}
                    source={require('../../assets/images/light.png')}
                    className="h-[160] w-[65] opacity-75"
                />
            </View>

            {/* title and form */}
            <View className="h-full w-full flex justify-around pt-40 pb-10">

                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-white font-bold tracking-wider text-5xl">
                        Login
                    </Animated.Text>
                </View>

                {/* form */}
                <View className="flex items-center mx-5 space-y-4">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-black/5 p-5 rounded-2xl w-full">

                        <TextInput
                            value={email}
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                            onChangeText={setEmail}
                        />
                        {errors.email && <Text className="text-red-500">{errors.email}</Text>}
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-5 rounded-2xl w-full mb-3">

                        <TextInput
                            value={password}
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                            onChangeText={setPassword}
                        />
                        {errors.password && <Text className="text-red-500">{errors.password}</Text>}
                    </Animated.View>

                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>

                        <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3" onPress={() => handleButton()} >
                            <Text className="text-xl font-bold text-white text-center">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(600).duration(1000).springify()}
                        className="flex-row justify-center">

                        <Text>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.push('SignUp')}>
                            <Text className="text-sky-600">SignUp</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </View>
    )
}