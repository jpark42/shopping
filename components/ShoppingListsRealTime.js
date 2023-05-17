import {
  Alert,
  StyleSheet,
  View,
  FlatList,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";

// import firebase functions for querying data
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  DocumentSnapshot,
} from "firebase/firestore";

// Importing storage for native apps
import AsyncStorage from "@react-native-async-storage/async-storage";

//Create and export the component, then destructuring the props "db" object that’s passed to the component
const ShoppingListsRealTime = ({ db, route, isConnected }) => {
  const { userID } = route.params;

  const [lists, setLists] = useState([]);
  const [listName, setListName] = useState("");
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");

  let unsubShoppinglists;

  /* useEffect() attaches listener only once, when component is mounted
        [] - dependency array is empty, we don't need to call useEffect more than once as
        it will will be automatically run whenever there’s a change in the targeted database reference
        
        onSnapshot() - checks whether there were any changes in the collection and its documents. Arguments:
        - collection(db, 'shopppinglists') - reference that you attach the listener to
        - The callback function that’s called whenever there’s a change detected in the reference.
        In this case, in callback function we get an id and key/value of the items and push them to newList array
        then we set newLists as a value for lists setLists(newLists);
    */
  // execute when component mounted or updated
  useEffect(() => {
    // If connected to internet, fetch data from firebase db. Else, call loadCacheLists() which fetches data from AsyncStorage instead
    if (isConnected === "true") {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
      if (unsubShoppinglists) unsubShoppinglists();
      unsubShoppinglists = null;

      const q = query(
        collection(db, "shopppinglists"),
        where("uid", "==", userID)
      );

      unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
        let newLists = [];
        documentsSnapshot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        cacheShoppingLists(newLists);
        setLists(newLists);
      });
    } else loadCachedLists();

    // execute when the component will be unmounted
    // to clean the memory when listener is not needed any more
    return () => {
      if (unsubShoppinglists) unsubShoppinglists();
    };
    //ShoppingLists’s useEffect() callback function can be called multiple times, as isConnected’s status can change at any time.
  }, [isConnected]);

  // async function that sets lists with cached value
  // || [] will assign an empty array to cachedLists if when the shopping_lists item hasn’t been set yet in AsyncStorage
  const loadCachedLists = async () => {
    const cachedLists = (await AsyncStorage.getItem("shopping_lists")) || [];
    setLists(JSON.parse(cachedLists));
  };

  const cacheShoppingLists = async (listsToCache) => {
    try {
      await AsyncStorage.setItem(
        "shopping_lists",
        JSON.stringify(listsToCache)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const addShoppingList = async (newList) => {
    /*addDoc will add new document to collection and generate id
      we use db - database intialised in the App.js
      shoppinglists - name of the collection
      newList - object created from user inputs (listName, item1, item2)*/

    const newListRef = await addDoc(collection(db, "shopppinglists"), newList);
    /*If new document was successfuly created .id and .data() will be set on it.
      if newListRef.id exists (true) - alert success message
      if newListRef.id doesn't exist (false) - alert fail message*/

    if (newListRef.id) {
      /*setLists setter function to update lists state
        1.`${lists}` which is a dependency array of useEffect will change
        2. the userEffect code will be executed 
        3. fetchShoppingLists will be called again, fetching the updated data of shoppinglists collection from the database
        */
      setLists([newList, ...lists]);

      Alert.alert(`The list '${listName}' has been added.`);
    } else {
      Alert.alert(`Unable to add. Please try later`);
    }
  };

  return (
    <View style={styles.container}>
      {/** Flatlist is a react component that renders basic lists and works best with data that changes over time */}
      <FlatList
        style={styles.listsContainer}
        data={lists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            {/** join() converts an array into a string. It also adds a separator string between each element from the array once concatenated */}
            <Text>
              {item.name}: {item.items.join(", ")}
            </Text>
          </View>
        )}
      />
      {/** Using tertiary operator: if connected to internet, be able to access the form to add to shoppingLists */}
      {/**if not connected to internet, disable access to the form to add shoppingLists by setting value to null */}
      {isConnected === true ? (
        <View style={styles.listForm}>
          <TextInput
            style={styles.listName}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #1"
            value={item1}
            onChangeText={setItem1}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #2"
            value={item2}
            onChangeText={setItem2}
          />
          {/** Creates new object out of 3 state's values and then calls addShoppingList function defined above*/}
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newList = {
                uid: userID,
                name: listName,
                items: [item1, item2],
              };
              addShoppingList(newList);
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView behavior="padding" />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    height: 70,
    justifyContent: "center",
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#AAA",
    flex: 1,
    flexGrow: 1,
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: "#CCC",
  },
  listName: {
    height: 50,
    padding: 15,
    fontWeight: "600",
    marginRight: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: "#555",
    borderWidth: 2,
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    backgroundColor: "#000",
    color: "#FFF",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 20,
  },
});

export default ShoppingListsRealTime;
