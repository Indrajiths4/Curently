import React, { useState } from 'react'
import { SafeAreaView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from '../../firebaseConfig'
import { collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebaseConfig';
import LottieView from 'lottie-react-native';
import { router } from 'expo-router';

const Signup = () => {
  const auth = getAuth();
  const [name, setName] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const usersCollectionRef = collection(firestore, 'users');

  const handleSignup = () => {
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Set user data with email as document ID
        const userDocRef = doc(usersCollectionRef, email);
        setDoc(userDocRef, {
          name: name,
          email: email
        })
        .then(() => {
          console.log("User data added successfully");
          router.replace('/Home');
        })
        .catch((error) => {
          console.error('Error adding user data: ', error);
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // Handle error
      });
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <LottieView
        source={require('../../assets/Animation - 1712257000816.json')}
        speed={0.5}
        autoPlay
        loop
        style={{ width: 400, height: 400 }}
      />
      <Text style={styles.title}>Sign up</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder='NAME'
          value={name}
          onChangeText={setName}
          autoCorrect={false}
          autoCapitalize='none'
          placeholderTextColor='rgba(0, 0, 0, 0.5)'
        />
        <TextInput
          style={styles.input}
          placeholder='EMAIL'
          value={email}
          onChangeText={setEmail}
          autoCorrect={false}
          autoCapitalize='none'
          placeholderTextColor='rgba(0, 0, 0, 0.5)'
        />
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder='PASSWORD'
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(text.length >= 6 ? "" : "Password must be at least 6 characters long");
            }}
            autoCorrect={false}
            autoCapitalize='none'
            placeholderTextColor='rgba(0, 0, 0, 0.5)'
          />
        </View>
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>
      <View style={styles.buttonView}>
        <Pressable
          style={[styles.button, { backgroundColor: 'black' }]}
          onPress={handleSignup}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "sans-serif-light",
    textAlign: "center",
    paddingVertical: 40,
    color: "black",
    fontFamily: 'Montserrat-Variable',
  },
  inputView: {
    width: "100%",
    marginBottom: 20
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "skyblue",
    borderWidth: 1,
    borderRadius: 7,
    color: 'black',
    backgroundColor: 'white',
    marginBottom: 15
  },
  buttonView: {
    width: "100%",
  },
  button: {
    height: 45,
    shadowColor: "#000",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'black'
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: 'white',
    fontFamily: 'Montserrat-Variable',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    fontSize :10,
    fontWeight:'bold',
    fontFamily: 'Montserrat-Variable',
  }
});

export default Signup;
