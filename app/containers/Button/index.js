import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, Text } from "react-native";
import Touchable from "react-native-platform-touchable";

import { themes } from "../../constants/colors";
import sharedStyles from "../../views/Styles";
import ActivityIndicator from "../ActivityIndicator";
import LinearGradient from "react-native-linear-gradient";
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    justifyContent: "center",
    height: 48,
    borderRadius: 2,
    width: "100%",
  },
  text: {
    fontSize: 16,
    ...sharedStyles.textMedium,
    ...sharedStyles.textAlignCenter,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default class Button extends React.PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    type: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool,
    backgroundColor: PropTypes.string,
    loading: PropTypes.bool,
    theme: PropTypes.string,
    color: PropTypes.string,
    fontSize: PropTypes.string,
    style: PropTypes.any,
  };

  static defaultProps = {
    title: "Press me!",
    type: "primary",
    onPress: () => alert("It works!"),
    disabled: false,
    loading: false,
  };

  render() {
    const {
      title,
      type,
      onPress,
      disabled,
      backgroundColor,
      color,
      loading,
      style,
      theme,
      fontSize,
      ...otherProps
    } = this.props;
    const isPrimary = type === "primary";

    let textColor = isPrimary ? "white" : "white";
    if (color) {
      textColor = color;
    }

    return (
      <LinearGradient
        colors={["#0000cc", "#0000ff", "#6666ff"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0.9 }}
        style={{
          marginBottom: 0,
          justifyContent: "center",
          alignSelf: "center",
          width: "90%",
          marginVertical: 10,
        }}
      >
        <Touchable
          onPress={onPress}
          disabled={disabled || loading}
          style={[styles.container, disabled && styles.disabled, style]}
          {...otherProps}
        >
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <Text
              style={[
                styles.text,
                { color: textColor },
                fontSize && { fontSize },
              ]}
              accessibilityLabel={title}
            >
              {title}
            </Text>
          )}
        </Touchable>
      </LinearGradient>
    );
  }
}
