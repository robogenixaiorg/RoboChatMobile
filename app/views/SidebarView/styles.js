import { StyleSheet } from "react-native";

import sharedStyles from "../Styles";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemCurrent: {
    backgroundColor: "#707274",
  },
  itemHorizontal: {
    marginHorizontal: 10,
    width: 30,
    alignItems: "center",
  },
  itemCenter: {
    flex: 1,
  },
  itemText: {
    marginVertical: 16,
    fontSize: 20,
    ...sharedStyles.textSemibold,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 4,
  },
  header: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  headerUsername: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    fontSize: 20,
    ...sharedStyles.textMedium,
  },
  avatar: {
    marginHorizontal: 10,
  },
  status: {
    marginRight: 5,
  },
  currentServerText: {
    fontSize: 20,
    ...sharedStyles.textSemibold,
  },
  version: {
    marginHorizontal: 10,
    marginBottom: 10,
    fontSize: 13,
    ...sharedStyles.textSemibold,
  },
  inverted: {
    transform: [{ scaleY: -1 }],
  },
});
