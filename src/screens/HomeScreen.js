import React from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    Alert,
    Pressable,
    View
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { GetPostWithAuth,UpdateTodoStatus,DeleteTodo,LogOut} from '../service/HttpService';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useState,useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [UserName, setUserName] = useState('');
    const logout = async() => {
        await LogOut();
        navigation.navigate('Login', {});
    };
    const fetchData = async () => {
        const response = await GetPostWithAuth("/api/todos/getTodoByUserId");
        if (response.status === 200) {
            console.log("Tasks fetched successfully");
            console.log(response.data);
            setData(response.data);
            setIsLoaded(true);
            
            
        } else {
            setIsLoaded(true);
            setError(response.status);
            console.log("Error fetching tasks");
        }
    };

    useEffect( () => {
        const fetchDataOnFocus = async () => {
            const name = await AsyncStorage.getItem('name');
            setUserName(name);
                await fetchData();
        };
        const unsubscribe = navigation.addListener('focus', fetchDataOnFocus);
        return () => {
            unsubscribe();
        };

    },[navigation]);
    
    const handleCheck = async (id,status) => {
        const updatedData = data.map((item) => {
            if (item.id === id) {
                item.isCompleted = !status;
            }
            return item;
        });
        setData(updatedData);
        var body = {
            "id": id,
            "isCompleted": !status
        };
        const response = await UpdateTodoStatus(body);
        console.log("response.statusHOME:", response.status);
        if (response.status === 200) {
            console.log("Task status updated successfully");
        } else {
            console.log("Error updating task status");
        }
    };
    const handleDeleteTodo = async (id) => {
        console.log("id:", id);
        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        const response = await DeleteTodo(id);
        if (response.status === 200) {
            console.log("Task deleted successfully");
        } else {
            console.log("Error deleting task");
        }
    };
    if(error){
        return (
            <View>
                <Text>Error: {error}</Text>
            </View>
        );
    }else if(!isLoaded){
        return (
            <View>
                <Text>Loading...</Text>
            </View>
        );
    }else{
    return (
        <SafeAreaView style={styles.container}>
            <View className='bg-white flex-row justify-between p-[10px] items-center'>
                <View className='flex-row gap-[7px] items-center'>
                    <View>
                        <Image
                            className=''
                            source={require('../../assets/images/user.jpg')}
                        />
                    </View>
                    <View>
                        <Text className='text-primary font-medium mb-[3px]'>{UserName}</Text>
                        <Text className='text-secondary'>Üye</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={()=> logout()}>
                    <View className='relative w-[36px] h-[36px] bg-[#F8F9FA] justify-center items-center rounded-full'>
                        <Feather name="log-out" size={20} color="#343A40" />
                        
                    </View>
                </TouchableOpacity>
            </View>
            <View className = 'mt-5 mx-[10px]'>

                <View className='flex-row justify-between'>
                    <Text className='text-[16px] text-primary font-medium'>Yapılacaklar Listesi</Text>
                    <TouchableOpacity className='flex-row gap-[7px] items-center' onPress={()=> navigation.navigate("AddTask",{}) }>
                        <Feather name="plus-circle" size={16} color="#3B5BDB" />
                        <Text className='text-main text-[13px]'>Task Ekle</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <SwipeListView
                disableRightSwipe={true}
                data={data}
                renderItem={(data, rowMap) => (
                    <Pressable onStartShouldSetResponder={() => true} onPress={() => handleCheck(data.item.id, data.item.isCompleted)} className={`border-[2px] border-white ${data.item.isCompleted && 'border-main'}  bg-white rounded-[6px] px-[10px] py-[10px] flex-row justify-between items-center mt-[10px]`} style={{borderColor : data.item.isCompleted ? '#3B5BDB' : '#cfcfcf' }}>
                        <View className='flex-row gap-5 items-center'>
                            
                            <View>
                                <Text className='text-primary text-[13px]'>{data.item.title}</Text>
                                <Text className={`mt-[3px] text-secondary text-[11px] ${data.item.isCompleted && 'line-through'}`}>{data.item.description}</Text>
                            </View>
                        </View>
                        <View>
                            <Checkbox
                                style={{ borderColor: '#cfcfcf' }}
                                className='rounded-[3px]'
                                value={data.item.isCompleted}
                                onValueChange={() => handleCheck(data.item.id, data.item.isCompleted)}
                                color={data.item.isCompleted ? '#3B5BDB' : undefined}
                            />
                        </View>
                    </Pressable>
                )}


                renderHiddenItem={(data, index) => (
                    <View style={styles.rightHiddenContainer}>
                        <TouchableOpacity
                            style={[styles.rightAction, { backgroundColor: '#bfbfbf' }]}
                            onPress={() => navigation.navigate("AddTask", { todoData:data.item})}
                        >
                            <Image
                                source={require('../../assets/images/pen.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.rightAction, { backgroundColor: 'red' }]}
                            onPress={() => {
                                handleDeleteTodo(data.item.id)
                            }}
                        >
                            <Image
                                source={require('../../assets/images/delete.png')}
                                style={{ width: 25, height: 25 }}
                            />
                        </TouchableOpacity>
                    </View>
                )}
                rightOpenValue={-200}
                leftOpenValue={0}
            />
        </SafeAreaView>
    );
                        }
}


const styles = StyleSheet.create({

    container: {
        paddingTop:50,
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 20,
    },

    ItemContainer: {
        
        height: 60,
        marginVertical: 10,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        paddingLeft: 10,

        elevation: 5,
    },

    rightAction: {
        width: '25%',
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 55,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        elevation: 5,
    },
    rightHiddenContainer: {
        width: 200,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flex: 1,
        right: 0,
        position: 'absolute',
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },

});

