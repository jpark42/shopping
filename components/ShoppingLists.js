import { View, FlatList, Text } from "react–native";
import { useState, useEffect } from "react";
// import firebase functions for querying data
import { collection, getDocs } from "firebase/firestore";

//Create and export the component, then destructuring the props "db" object that’s passed to the component
const ShoppingLists = ({ db }) => {
  const [lists, setLists] = useState([]);

  const fetchShoppingLists = async () => {
    /*db - database object passed as props from App.js
    shoppinglists - name of the collection in firebase*/
    const listsDocuments = await getDocs(collection(db, "shoppinglists"));

    //creating an empty array "newLists" that will contain new data filled by the forEach() loop
    let newLists = [];

    /* forEach() will help to get:
        - document id
        - the actuale document properties (name and items)
        .push - adds an object to the newLists variable
        using the ... operator, the properties of docObject.data() will be spread out - we will get it one by one (key: value), not as an object.*/
    listsDocuments.forEach((docObject) => {
      newLists.push({ id: docObject.id, ...docObject.data() });
    });

    //state setter function setLists assigning the new array to lists state
    setLists(newLists);
  };

  /* useEffect() fetches data object from db
    "lists" is in the dependency array of useEffect() to force a render cycle if the "lists" state changes
    this is necessary for the <FlatList> component that is later used */
  useEffect(() => {
    fetchShoppingLists();
  }, [`${lists}`]);

  return (
    <View styles={styles.container}>
      {/** Flatlist is a react component that renders basic lists and works best with data that changes over time */}
      <FlatList
        data={lists}
        renderItem={({ item }) => (
          <Text>
            {/** join() converts an array into a string. It also adds a separator string between each element from the array once concatenated */}
            {item.name}: {item.items.join(", ")}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ShoppingLists;
