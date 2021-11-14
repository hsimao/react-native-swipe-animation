import React, { useRef } from "react";
import { Animated, View, PanResponder } from "react-native";
import styled from "styled-components/native";

export default function Deck({ data, renderCard }) {
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

  const renderCards = () => {
    return data.map((item, index) => {
      if (index === 0) {
        return (
          <Animated.View
            key={item.id}
            style={{
              transform: [
                { translateX: position.x },
                { translateY: position.y }
              ]
            }}
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
