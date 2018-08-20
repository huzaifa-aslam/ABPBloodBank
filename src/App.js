import React from 'react';
import { View, ActivityIndicator, AsyncStorage } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import firebase from 'react-native-firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { connect } from 'react-redux';
import { getReady } from './actions';
import Profile from './screens/Profile';
import Donors from './screens/Donors';
import { Icon } from 'react-native-elements';

// Create the main navigator
const MainNavigator = createBottomTabNavigator(
  {
    Donors: {
      screen: Donors
    },
    Profile: {
      screen: Profile
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Donors') {
          iconName = 'drop';
        } else if (routeName === 'Profile') {
          iconName = 'user';
        }

        return <Icon name={iconName} size={30} color={tintColor} type="entypo" />;
      }
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'orange'
    }
  }
);

// Define root component, load current user and data
class App extends React.Component {
  componentDidMount() {
    this.load();
    // this.authenticate();
  }

  async load() {
    const currentUser = JSON.parse(await AsyncStorage.getItem('currentUser')) || { uid: null, admin: false };
    const users = (await firebase
      .database()
      .ref('/users')
      .once('value')).val();

    this.props.dispatch(getReady(currentUser, users));
  }

  async authenticate() {
    const result = LoginManager.log
    const accessToken = AccessToken.getCurrentAccessToken();
    console.log(accessToken);
  }

  render() {
    if (!this.props.ready) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }
    return <MainNavigator />;
  }
}

export default connect(state => ({ ready: state.ready }))(App);
