import { StyleSheet } from 'react-native';

import sharedStyles from '../Styles';

export default StyleSheet.create({
	serverName: {
		...sharedStyles.textSemibold,
		fontSize: 30,
		marginBottom: 4,
	  },
	  serverUrl: {
		...sharedStyles.textRegular,
		fontSize: 24,
		marginBottom: 24
	  },
	  registrationText: {
		fontSize: 24,
		...sharedStyles.textRegular,
		...sharedStyles.textAlignCenter
	  },
	  alignItemsCenter: {
		alignItems: 'center'
	  }
});
