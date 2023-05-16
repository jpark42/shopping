import { LogBox, Alert } from "react-native";
import { useEffect } from "react";

// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from "firebase/firestore";

// useNetInfo() keeps track of the network’s connectivity and updates in real time.
import { useNetInfo } from "@react-native-community/netinfo";

// import the screens
// import ShoppingLists from "./components/ShoppingLists";
import ShoppingListsRealTime from "./components/ShoppingListsRealTime";
import Welcome from "./components/Welcome";

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCWMBsQZOC2a5HdhqSWLoTJF28RLQoGMZk",
    authDomain: "shoppping-list-demo.firebaseapp.com",
    projectId: "shoppping-list-demo",
    storageBucket: "shoppping-list-demo.appspot.com",
    messagingSenderId: "260606318526",
    appId: "1:260606318526:web:f1a2e9b72c17f697070bef",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  // When using this in other components, you can read from, and write into, your database via your app
  const db = getFirestore(app);

  //defining new state that represents online connectivity status
  const connectionStatus = useNetInfo();

  // connectionStatus.isConnected used as a dependency value of useEffect()
  // If this value changes, the useEffect code will be re-executed
  // Disable attempts to keep trying to reconnect to firebase if there is no connection
  // Enable access to database on firebase if user is connected to internet
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      {/** initalizing the default landing screen to the ShoppingLists component */}
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        {/** Passing additional props to the ShoppingLists component. Can now access the db prop variable in ShoppingLists.js. */}
        {/** Also passing boolean value of connectionStatus.isConnected as a prop so you can access isConnected in ShoppingLists.js */}
        <Stack.Screen name="ShoppingListsRealTime">
          {(props) => (
            <ShoppingListsRealTime
              isConnected={connectionStatus.isConnected}
              db={db}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
