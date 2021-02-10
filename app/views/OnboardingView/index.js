import React from "react";
import { View, Text, Image, Linking } from "react-native";
import PropTypes from "prop-types";
import Orientation from "react-native-orientation-locker";

import I18n from "../../i18n";
import Button from "../../containers/Button";
import styles from "./styles";
import { isTablet } from "../../utils/deviceInfo";
import { themes } from "../../constants/colors";
import { withTheme } from "../../theme";
import FormContainer, {
  FormContainerInner,
} from "../../containers/FormContainer";
import { logEvent, events } from "../../utils/log";
import LinearGradient from "react-native-linear-gradient";
class OnboardingView extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  static propTypes = {
    navigation: PropTypes.object,
    theme: PropTypes.string,
  };

  constructor(props) {
    super(props);
    if (!isTablet) {
      Orientation.lockToPortrait();
    }
  }

  shouldComponentUpdate(nextProps) {
    const { theme } = this.props;
    if (theme !== nextProps.theme) {
      return true;
    }
    return false;
  }

  connectServer = () => {
    logEvent(events.ONBOARD_JOIN_A_WORKSPACE);
    const { navigation } = this.props;
    navigation.navigate("NewServerView");
  };

  createWorkspace = async () => {
    logEvent(events.ONBOARD_CREATE_NEW_WORKSPACE);
    try {
      await Linking.openURL("https://cloud.rocket.chat/trial");
    } catch {
      logEvent(events.ONBOARD_CREATE_NEW_WORKSPACE_F);
    }
  };

  render() {
    const { theme } = this.props;
    return (
      <>
        <LinearGradient
          style={{ flex: 1 }}
          colors={["dodgerblue", "#ff4da6", "#ff6666"]}
          start={{ x: 0.0, y: 1 }}
          end={{ x: 1, y: 0 }}
          locations={[0, 0.5, 0.9]}
        >
          <View>
            <Image
              style={styles.onboarding}
              source={require("../../static/images/logo.png")}
              fadeDuration={0}
            />
            <Text style={[styles.title, { color: themes[theme].titleText }]}>
              {I18n.t("Onboarding_title")}
            </Text>
            <Text style={[styles.subtitle, { color: "black" }]}>
              {I18n.t("Onboarding_subtitle")}
            </Text>
            <Text style={[styles.description, { color: "black" }]}>
              {I18n.t("Onboarding_description")}
            </Text>
            <View style={styles.buttonsContainer}>
              <Button
                title={I18n.t("Onboarding_join_workspace")}
                type="primary"
                onPress={this.connectServer}
                testID="join-workspace"
              >
                <LinearGradient colors={["yellow", "pink"]}></LinearGradient>
              </Button>
            </View>
          </View>
        </LinearGradient>
      </>
    );
  }
}

export default withTheme(OnboardingView);
