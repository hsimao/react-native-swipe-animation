import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo
} from "react";
import {
  Animated,
  LayoutAnimation,
  UIManager,
  PanResponder,
  useWindowDimensions,
  Platform
} from "react-native";
import styled from "styled-components/native";

const CardWrapper = styled(Animated.View)`
  position: absolute;
  width: 100%;
`;

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function Deck({
  data,
  renderCard,
  renderNoMoreCard,
  onSwipeLeft,
  onSwipeRight
}) {
  const SCREEN_WIDTH = useWindowDimensions().width;
  const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
  const SWIPE_OUT_DURATION = 250;

  const [dataIndex, setDataIndex] = useState(0);

  const position = useRef(new Animated.ValueXY()).current;

  useEffect(() => {
    setDataIndex(0);
  }, [data]);

  const resetPosition = () => {
    // 彈回去原本位置
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start();
  };

  const handleSwipeComplete = (direction) => {
    const item = data[dataIndex];
    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    setDataIndex((prevValue) => (prevValue += 1));
    position.setValue({
      x: 0,
      y: 0
    });
    LayoutAnimation.spring();
  };

  const forceSwipe = (direction) => {
    const offsetX = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;

    Animated.timing(position, {
      toValue: { x: offsetX, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false
    }).start(() => handleSwipeComplete(direction));
  };

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
      // 放開了所有觸碰
      onPanResponderRelease: (evt, gestureState) => {
        // 將偏移值合併到基值中並將偏移重置為零
        // position.flattenOffset();

        if (gestureState.dx > SWIPE_THRESHOLD) {
          forceSwipe("right");
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          forceSwipe("left");
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const getCardStyle = useMemo(() => {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"]
    });

    return {
      transform: [
        { translateX: position.x },
        { translateY: position.y },
        { rotate }
      ]
    };
  }, [position]);

  const renderCards = useCallback(() => {
    if (dataIndex >= data.length) {
      return renderNoMoreCard();
    }

    return data
      .map((item, index) => {
        if (index < dataIndex) {
          return null;
        }

        if (index === dataIndex) {
          return (
            <CardWrapper
              key={item.id}
              style={getCardStyle}
              {...panResponder.panHandlers}
            >
              {renderCard(item)}
            </CardWrapper>
          );
        }
        return (
          <CardWrapper
            style={{
              top: 10 * (index - dataIndex)
            }}
            key={item.id}
          >
            {renderCard(item)}
          </CardWrapper>
        );
      })
      .reverse();
  }, [dataIndex]);

  return <>{renderCards()}</>;
}
