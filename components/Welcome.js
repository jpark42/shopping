import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { getAuth, signInAnonymously } from "firebase/auth";

const Welcome = ({ navigation }) => {
  const auth = getAuth();

  const signInUser = () => {
    /* signInAnonymously() returns a promise
    we get an information object (represented by result) 
    as the user is signed in, the app navigates to ShoppingListsRealTime
    we also pass result.user.uid (which is assigned to the route parameter userID) */
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate("ShoppingListsRealTime", {
          userID: result.user.uid,
        });
        Alert.alert("Signed in Successfully!");
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Shopping Lists</Text>
      <TouchableOpacity style={styles.startButton} onPress={signInUser}>
        <Text style={styles.startButtonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  appTitle: {
    fontWeight: "600",
    fontSize: 45,
    marginBottom: 100,
  },
  startButton: {
    backgroundColor: "#000",
    height: 50,
    width: "88%",
    justifyContent: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: "#FFF",
  },
});

export default Welcome;
