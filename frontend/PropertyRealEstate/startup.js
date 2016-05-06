'use strict';
import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  Text,
  View,
  Image
} from 'react-native';

const API_URL = 'http://192.168.1.126:3000';

const ACCESS_TOKEN = 'access_token';

class Startup extends Component {

  componentWillMount() {
    this.getToken();
  }
  navigate(routeName) {
    this.props.navigator.push({
      name: routeName
    });
  }

  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      if(!accessToken) {
          console.log("Token not set");
      } else {
          this.verifyToken(accessToken)
      }
    } catch(error) {
        console.log("Something went wrong");
    }
  }
  //If token is verified we will redirect the user to the home page
  async verifyToken(token) {
    let accessToken = token

    try {
      let response = await fetch(API_URL + '/api/verify?session%5Baccess_token%5D=' + accessToken);
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
        //Verified token means user is loggen in to we redirect to home.
        console.log(response)
        this.navigate('home');
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        console.log("error response: " + error);
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Image
          style={styles.icon}
          source={require('./assets/holding_a_house.png')}
        />
        <TouchableHighlight onPress={ this.navigate.bind(this, 'login') } style={styles.buttonLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={ this.navigate.bind(this,'register') } style={styles.buttonRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10,
    paddingTop: 120
  },
  buttonLogin: {
    height: 50,
    backgroundColor: '#006600',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonRegister: {
    height: 50,
    backgroundColor: '#680000',
    alignSelf: 'stretch',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  title: {
    fontSize: 25,
    marginBottom: 15
  },
  icon: {
    borderRadius: 75,
    width: 150,
    height: 150,
    marginBottom: 15
  }
});


export default Startup
