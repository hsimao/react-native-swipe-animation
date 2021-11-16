import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Deck from "./src/Deck";
import { Card, Button } from "react-native-elements";

const cardList = [
  {
    id: 1,
    text: "Card #1",
    uri: "https://picsum.photos/400/270/?random"
  },
  {
    id: 2,
    text: "Card #2",
    uri: "https://picsum.photos/400/290/?random"
  },
  {
    id: 3,
    text: "Card #3",
    uri: "https://picsum.photos/390/270/?random"
  },
  {
    id: 4,
    text: "Card #4",
    uri: "https://picsum.photos/385/274/?random"
  },
  {
    id: 5,
    text: "Card #5",
    uri: "https://picsum.photos/420/270/?random"
  },
  {
    id: 6,
    text: "Card #6",
    uri: "https://picsum.photos/400/320/?random"
  },
  {
    id: 7,
    text: "Card #7",
    uri: "https://picsum.photos/400/285/?random"
  },
  {
    id: 8,
    text: "Card #8",
    uri: "https://picsum.photos/400/330/?random"
  }
];

export default function App() {
  const renderCard = (item) => {
    return (
      <Card containerStyle={{ paddingLeft: 0, paddingRight: 0 }} key={item.id}>
        <Card.Title style={{ paddingTop: 4 }}>{item.text}</Card.Title>
        <Card.Image source={{ uri: item.uri }} />
        <Text style={{ padding: 16 }}>I can customize the card</Text>
        <Button
          icon={{ name: "code" }}
          style={{ padding: 16 }}
          backgroundColor="#03a9f4"
          title="View Now!"
        />
      </Card>
    );
  };

  const renderNoMoreCard = () => {
    return (
      <Card>
        <Card.Title>All Done!</Card.Title>
        <Text style={{ padding: 16 }}>There's no more content here!</Text>
        <Button backgroundColor="#03a9f4" title="Get more!" />
      </Card>
    );
  };

  const onSwipeLeft = (item) => {
    console.log("onSwipeLeft", item);
  };

  const onSwipeRight = (item) => {
    console.log("onSwipeRight", item);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Deck
        data={cardList}
        renderCard={renderCard}
        renderNoMoreCard={renderNoMoreCard}
        onSwipeRight={onSwipeRight}
        onSwipeLeft={onSwipeLeft}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
