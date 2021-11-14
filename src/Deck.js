import React, { useRef } from "react";
import { Animated, PanResponder, useWindowDimensions } from "react-native";

export default function Deck({ data, renderCard }) {
  const screenWidth = useWindowDimensions().width;
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      // 是否允許繼續執行觸碰事件
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: () => {
        position.setOffset({
          x: position.x._value,
          y: position.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (evt, gestureState) => {
        // 放開了所有觸碰
        position.flattenOffset();
      }
    })
  ).current;

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-screenWidth * 1.5, 0, screenWidth * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate }
      ]
    };
  };

  const renderCards = () => {
    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={getCardStyle()}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
      return renderCard(item);
    });
  };

  return <>{renderCards()}</>;
}