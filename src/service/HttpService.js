import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PostWithoutAuth = async (url, body) => {
    console.log("PostWithoutAuth url:", body);
   try {
        var response = await axios({
            method: "POST",
            url: API_URL + url,
            data: body
        });

        console.log("response.status:", response.status);
        return response;
    }catch(e){
        console.log("error:", e.response.data);
        return e.response;
    }
};

export const GetPostWithAuth = async (url) => {
    
        try{
            var token = await AsyncStorage.getItem('token');
            var response = await axios({
                method: "GET",
                url: API_URL + url,
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            return response;
        }catch(e){
            console.log("error:", e.response.status);
            return e.response;
        }

 }

 export const UpdateTodoStatus = async (body) => {
    console.log("UpdateTodoStatus body:", body);
    try{
        var token = await AsyncStorage.getItem('token');
        console.log("token:", token);
        var response = await axios({
            method: "PUT",
            url: API_URL + "/api/todos/updateTodoStatus",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: body
        }
        );
        console.log("response.status:", response.status);
        return response;
    }catch(e){
        console.log("error:", e.response.status);
        return e.response;
    }
 }
 export const DeleteTodo = async (id) => {
    try{
        console.log("DeleteTodo id:", id);
        var token = await AsyncStorage.getItem('token');
        var response = await axios({
            method: "DELETE",
            url: API_URL + "/api/todos/deleteTodo/",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                "id": id
            }
        });
        return response;
    }catch(e){
        console.log("error:", e.response.status);
        return e.response;
    }
 }

export const UpdateTodo = async (body) => {
    console.log("UpdateTodo body:", body);
    try{
        var token = await AsyncStorage.getItem('token');
        var response = await axios({
            method: "PUT",
            url: API_URL + "/api/todos/updateTodo",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: body
        });
        return response;
    }catch(e){
        console.log("error:", e.response.status);
        return e.response;
    }
}

export const CreateTodo = async (body) => {
    console.log("CreateTodo body:", body);
    try{
        var token = await AsyncStorage.getItem('token');
        var response = await axios({
            method: "POST",
            url: API_URL + "/api/todos/createTodo",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: body
        });
        return response;
    }catch(e){
        console.log("error:", e.response.status);
        return e.response;
    }
}

export const LogOut = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('currentId');
    await AsyncStorage.removeItem('name');
};