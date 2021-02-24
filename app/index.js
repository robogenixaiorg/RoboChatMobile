import React from 'react';
import { Linking, Dimensions, Text, View, Button } from 'react-native';
import { AppearanceProvider } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { KeyCommandsEmitter } from 'react-native-keycommands';
import RNScreens from 'react-native-screens';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import crashlytics from "@react-native-firebase/crashlytics";
import {
	defaultTheme,
	newThemeState,
	subscribeTheme,
	unsubscribeTheme
} from './utils/theme';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import UserPreferences from './lib/userPreferences';
import EventEmitter from './utils/events';
import { appInit, appInitLocalSettings, setMasterDetail as setMasterDetailAction } from './actions/app';
import { deepLinkingOpen } from './actions/deepLinking';
import parseQuery from './lib/methods/helpers/parseQuery';
import { initializePushNotifications, onNotification } from './notifications/push';
import store from './lib/createStore';
import { loggerConfig, analytics } from './utils/log';
import { ThemeContext } from './theme';
import { DimensionsContext } from './dimensions';
import RocketChat, { THEME_PREFERENCES_KEY } from './lib/rocketchat';
import { MIN_WIDTH_MASTER_DETAIL_LAYOUT } from './constants/tablet';
import {
	isTablet, supportSystemTheme
} from './utils/deviceInfo';
import { KEY_COMMAND } from './commands';
import AppContainer from './AppContainer';
import TwoFactor from './containers/TwoFactor';
import ScreenLockedView from './views/ScreenLockedView';
import ChangePasscodeView from './views/ChangePasscodeView';
import Toast from './containers/Toast';
import InAppNotification from './containers/InAppNotification';
import { ActionSheetProvider } from './containers/ActionSheet';
import debounce from './utils/debounce';
import { isFDroidBuild } from './constants/environment';



RNScreens.enableScreens();

const parseDeepLinking = (url) => {
	if (url) {
		url = url.replace(/robochat:\/\/|https:\/\/robochat.page.link\/|https:\/\/robochat.robogenix.ai\//,'');
		const regex = /^(room|auth|invite)\?/;
		if (url.match(regex)) {
			url = url.replace(regex, '').trim();
			if (url) {
				return parseQuery(url);
			}
		}
		const call = /^(https:\/\/)?jitsi.rocket.chat\//;
		if (url.match(call)) {
			url = url.replace(call, '').trim();
			if (url) {
				return { path: url, isCall: true };
			}
		}
	}
	return null;
};



// let deepLinkUnsubscribe = ()=>{

// };

export default class Root extends React.Component {
	constructor(props) {
		super(props);
		this.init();
		if (!isFDroidBuild) {
			this.initCrashReport();
		}
		const {
			width, height, scale, fontScale
		} = Dimensions.get('window');
		this.state = {
			isSubscribed :false,
			theme: defaultTheme(),
			themePreferences: {
				currentTheme: supportSystemTheme() ? 'automatic' : 'light',
				darkLevel: 'dark'
			},
			width,
			height,
			scale,
			fontScale
		};
		if (isTablet) {
			this.initTablet();
		}
	}

	handleDynamicLink = (link) => {
		const parsedDeepLinkingURL = parseDeepLinking(link.url);
		if (parsedDeepLinkingURL) {
			store.dispatch(deepLinkingOpen(parsedDeepLinkingURL));
		}

	}
	onReceived(notification) {
		console.log("Received Notification: ", notification);
		}
		onOpened(openResult) {
		//perform logging
		console.log("Opened Notification");
		console.log('Message: ', openResult.notification.payload.body);
		console.log('Data: ', openResult.notification.payload.additionalData);
		console.log('isActive: ', openResult.notification.isAppInFocus);
		console.log('openResult: ', openResult);
		}
		onRegistered(notifData) {
		// triggered when device is registered for using push notification
		console.log("Device had been registered for push notifications!", notifData);
		}
		onIds(device) {
		console.log('Device info: ', device);
		}

	async componentDidMount() {	
		// throw new Error('This is a test javascript crash!');
			
		this.listenerTimeout = setTimeout(() => {
			// deepLinkUnsubscribe = dynamicLinks().onLink(this.handleDynamicLink);
				dynamicLinks()
				.getInitialLink()
				.then((link) => {	
					const parsedDeepLinkingURL = parseDeepLinking(link.url);
						if (parsedDeepLinkingURL) {
							store.dispatch(deepLinkingOpen(parsedDeepLinkingURL));
						}
				});
				
				dynamicLinks().onLink(async (link) => {
					const parsedDeepLinkingURL = parseDeepLinking(link.url);
						if (parsedDeepLinkingURL) {
							store.dispatch(deepLinkingOpen(parsedDeepLinkingURL));
						}
				   
				  });
			// Linking.addEventListener('url', ({ url }) => {
							
			// });
		}, 1500);
		Dimensions.addEventListener('change', this.onDimensionsChange);
		
    }
		
	

	componentWillUnmount() {
		// deepLinkUnsubscribe();
		clearTimeout(this.listenerTimeout);
		Dimensions.removeEventListener('change', this.onDimensionsChange);
		unsubscribeTheme();
		if (this.onKeyCommands && this.onKeyCommands.remove) {
			this.onKeyCommands.remove();
		}
		
	}

	CustomFallback = (props) => (
		<View>
		  <Text>Something happened!</Text>
		  <Text>{props.error.toString()}</Text>
		  <Button onPress={props.resetError} title={'Try again'} />
		</View>
	  )

	init = async() => {
		UserPreferences.getMapAsync(THEME_PREFERENCES_KEY).then(this.setTheme);
		const [notification, deepLinking] = await Promise.all([initializePushNotifications(), Linking.getInitialURL()]);
		const parsedDeepLinkingURL = parseDeepLinking(deepLinking);
		store.dispatch(appInitLocalSettings());
		if (notification) {
			onNotification(notification);
		} else if (parsedDeepLinkingURL) {
			store.dispatch(deepLinkingOpen(parsedDeepLinkingURL));
		} else {
			store.dispatch(appInit());
		}
	}

	getMasterDetail = (width) => {
		if (!isTablet) {
			return false;
		}
		return width > MIN_WIDTH_MASTER_DETAIL_LAYOUT;
	}

	setMasterDetail = (width) => {
		const isMasterDetail = this.getMasterDetail(width);
		store.dispatch(setMasterDetailAction(isMasterDetail));
	};

	// Dimensions update fires twice
	onDimensionsChange = debounce(({
		window: {
			width, height, scale, fontScale
		}
	}) => {
		this.setDimensions({
			width, height, scale, fontScale
		});
		this.setMasterDetail(width);
	})

	setTheme = (newTheme = {}) => {
		// change theme state
		this.setState(prevState => newThemeState(prevState, newTheme), () => {
			const { themePreferences } = this.state;
			// subscribe to Appearance changes
			subscribeTheme(themePreferences, this.setTheme);
		});
	}

	setDimensions = ({
		width, height, scale, fontScale
	}) => {
		this.setState({
			width, height, scale, fontScale
		});
	}

	initTablet = () => {
		const { width } = this.state;
		this.setMasterDetail(width);
		this.onKeyCommands = KeyCommandsEmitter.addListener(
			'onKeyCommand',
			(command) => {
				EventEmitter.emit(KEY_COMMAND, { event: command });
			}
		);
	}

	initCrashReport = () => {
		RocketChat.getAllowCrashReport()
			.then((allowCrashReport) => {
				if (!allowCrashReport) {
					loggerConfig.autoNotify = false;
					loggerConfig.registerBeforeSendCallback(() => false);
					analytics().setAnalyticsCollectionEnabled(false);
				}
			});
	}

	render() {
		const {
			themePreferences, theme, width, height, scale, fontScale
		} = this.state;
		
		return (
			
			<SafeAreaProvider initialMetrics={initialWindowMetrics}>
				
				<AppearanceProvider>
				
					<Provider store={store}>
						<ThemeContext.Provider
							value={{
								theme,
								themePreferences,
								setTheme: this.setTheme
							}}
						>
							<DimensionsContext.Provider
								value={{
									width,
									height,
									scale,
									fontScale,
									setDimensions: this.setDimensions
								}}
							>
								<ActionSheetProvider>
									<AppContainer />
									<TwoFactor />
									<ScreenLockedView />
									<ChangePasscodeView />
									<InAppNotification />
									<Toast />
								</ActionSheetProvider>
							</DimensionsContext.Provider>
						</ThemeContext.Provider>
					</Provider>
				</AppearanceProvider>
			</SafeAreaProvider>
			
		);
	}
}
