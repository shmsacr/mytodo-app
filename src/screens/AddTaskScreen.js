import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Button, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute, } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Appbar } from 'react-native-paper';
import { UpdateTodo,CreateTodo } from '../service/HttpService';
import { validateTodo } from '../validation/Validation';
export default function AddTaskScreen() {
    const navigation = useNavigation();
      const route = useRoute();
    const { todoData} = route.params || {}; 
    const [title, setTitle] = useState(todoData && todoData.title ? todoData.title : "");
    const [description, setDescription] = useState(todoData && todoData.description ? todoData.description : "");
    const [errors, setErrors] = useState({ title: '', description: '' });
    
    const handleSave = async ()  => {
        const validationErrors = validateTodo({ title, description });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            var body = {
                "title": title,
                "description": description,
            };
            const response = await CreateTodo(body);
            if (response.status === 200) {
                console.log("Task added successfully");
                navigation.navigate("Home");
            } else {
                console.log("Error adding task");
            }
        }
    };
    const handleUpdate = async () => { 
        const validationErrors = validateTodo({ title, description });
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            var body = {
                "id": todoData.id,
                "title": title,
                "description": description,
                "isCompleted": todoData.isCompleted
            };
            const response = await UpdateTodo(body);
            if (response.status === 200) {
                console.log("Task updated successfully");
                navigation.navigate("Home");
            } else {
                console.log("Error updating task");
            }
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <Appbar style={{ backgroundColor: '#F4F3F3' }} >
                <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
                <Appbar.Content title={todoData ? "Update Task" : "Add Task"} />

            </Appbar>
            <View className="flex items-center mx-5 space-y-4" >
                <Animated.View
                    entering={FadeInDown.duration(1000).springify()}
                    className="bg-black/5 p-5 rounded-2xl w-full">

                    <TextInput
                        value={title}
                        placeholder="Title"
                        placeholderTextColor={'gray'}
                        onChangeText={setTitle}
                    />
                    {errors.title ? <Text className="text-red-500 text-sm">{errors.title}</Text> : null}
                </Animated.View>
                <Animated.View
                    entering={FadeInDown.delay(200).duration(1000).springify()}
                    className="bg-black/5 p-5 rounded-2xl w-full mb-3">

                    <TextInput
                        value={description}
                        placeholder="Description"
                        multiline={true}
                        numberOfLines={4}
                        style={{ textAlign: "left", textAlignVertical: "top" }}
                        placeholderTextColor={'gray'}
                        onChangeText={setDescription}
                    />
                    {errors.description ? <Text className="text-red-500 text-sm">{errors.description}</Text> : null}
                </Animated.View>

                <Animated.View
                    className="w-full"
                    entering={FadeInDown.delay(400).duration(1000).springify()}>

                    <TouchableOpacity className="w-full bg-sky-400 p-3 rounded-2xl mb-3" onPress={() => todoData ? handleUpdate() : handleSave()} >
                        {todoData ? <Text className="text-xl font-bold text-white text-center">Update</Text> : <Text className="text-xl font-bold text-white text-center">Add Task</Text>}
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F4F3F3',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
});