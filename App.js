// import react Navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// import the screens
import ShoppingLists from "./components/ShoppingLists";

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

  return (
    <NavigationContainer>
      {/** initalizing the default landing screen to the ShoppingLists component */}
      <Stack.Navigator initialRouteName="ShoppingLists">
        {/** Passing additional props to the ShoppingLists component. Can now access the db prop variable in ShoppingLists.js. */}
        <Stack.Screen name="ShoppingLists">
          {(props) => <ShoppingLists db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
