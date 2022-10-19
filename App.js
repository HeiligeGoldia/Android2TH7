
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
// import {launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  GDrive,
  MimeTypes
} from "@robinbobin/react-native-google-drive-api-wrapper";

// const express = require('express');
// const multer = require('multer');
// const bodyParser = require('body-parser');

export default function App() {
  const [value, setValue] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://6346d54bdb768439769f9843.mockapi.io/api/User2")
      .then((res) => res.json())
      .then((users) => {
        setUsers(users);
      });
  }, []);

  const render = ({ item }) => {
    return (
      <View style={{flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{marginLeft: 5, marginRight: 5, width: 25}}>{item.id}</Text>
        <Image style={{width: 50, height: 50, marginRight: 15}} source={{uri: item.image}}></Image>
        <Text style={{marginRight: 10, width: 170}}>{item.name}</Text>
        <TouchableOpacity style={{alignItems: 'center', justifyContent: 'center', backgroundColor: 'grey', width: 65}} onPress={() => {
          deleteUser(item.id);
        }}>
          <Text style={{color: 'white'}}>Remove</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // const handleChoosePhoto = () => {
  //   launchImageLibrary({ noData: true }, (response) => {
  //     console.log("--------"+response)+"--------";
  //     if (response) {
  //       setPhoto(response);
  //     }
  //   })
  // }

  const addUser = () => {
    if (value.length > 0) {
      if(users.length == 0){
        setUsers(users => [...users, {id: 1, name: value}])
      }
      else{
        setUsers(users => [...users, {id: parseInt(users[users.length-1].id)+1, name: value}])
      }
      
      axios
        .post("https://6346d54bdb768439769f9843.mockapi.io/api/User2", {
          name: value,
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const deleteUser = async(id) => {
    fetch(`https://6346d54bdb768439769f9843.mockapi.io/api/User2/${id}`, { method: "DELETE" });
    setUsers(users.filter((u) => u.id !== id));
  }
  
  return (
    <View style={{marginTop: 10}}>
      <View style={{flexDirection: 'row', borderBottomColor: 'black', borderBottomWidth: 1, alignItems: 'center'}}>
        <View style={{borderColor: 'black', marginTop: 50, marginBottom: 30, marginLeft: 30, borderWidth: 2, flex: 4, height: 40}}>
          <TextInput placeholder='Name' style={{padding: 4, paddingLeft: 10}} onChangeText={(e) => setValue(e)}></TextInput>
          <TouchableOpacity onPress={() => {
            pickImage()
          }}>
            <Text style={{margin: 5}}>Upload</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{flex: 1, marginTop: 50, marginBottom: 30, marginLeft: 25, marginRight: 30, 
            backgroundColor: '#43e06e', alignItems: 'center', justifyContent: 'center', height: 40 }} onPress={()=>{
          addUser();
        }}>
          <Text style={{color: 'white'}}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList style={{marginBottom: 125, marginTop: 3}} data={users} renderItem={render} keyExtractor={item => item.id}>
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
