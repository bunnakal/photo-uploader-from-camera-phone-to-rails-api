'use strict';
import React, {
  Component,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AsyncStorage,
  Text,
  View,
  ToolbarAndroid
} from 'react-native';

var Icon = require('react-native-vector-icons/Ionicons');

const API_URL = 'http://192.168.1.126:3000';
const ACCESS_TOKEN = 'access_token';

class Login extends Component {
  constructor(){
    super();

    this.state = {
      email: "",
      password: "",
      error: "",
      showProgress: false,
    }
  }
  redirect(routeName, accessToken){
    this.props.navigator.push({
      name: routeName
    });
  }
  storeToken(responseData){
    AsyncStorage.setItem(ACCESS_TOKEN, responseData, (err)=> {
      if(err){
        console.log("an error");
        throw err;
      }
      console.log("success");
    }).catch((err)=> {
        console.log("error is: " + err);
    });
  }
  async onLoginPressed() {
    this.setState({showProgress: true})
    try {
      let response = await fetch(API_URL + '/api/login', {
                              method: 'POST',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                session:{
                                  email: this.state.email,
                                  password: this.state.password,
                                }
                              })
                            });
      let res = await response.text();
      if (response.status >= 200 && response.status < 300) {
          //Handle success
          let accessToken = res;
          console.log(accessToken);
          //On success we will store the access_token in the AsyncStorage
          this.storeToken(accessToken);
          this.redirect('home');
      } else {
          //Handle error
          let error = res;
          throw error;
      }
    } catch(error) {
        this.setState({error: error});
        console.log("error " + error);
        this.setState({showProgress: false});
    }
  }
  backButton(){
    return this.props.navigator.pop();
  }
  render() {
    return (
      <View style={styles.wraper}>
        <Icon.ToolbarAndroid
           title="Login"
           navIconName="android-arrow-back"
           titleColor="white"
           onIconClicked={this.backButton.bind(this)}
           style={styles.toolbar}
         />
        <View style={styles.container}>
          <Text style={styles.heading}>
            Login Credentail
          </Text>
          <TextInput
            onChangeText={ (text)=> this.setState({email: text}) }
            style={styles.input} placeholder="Email">
          </TextInput>
          <TextInput
            onChangeText={ (text)=> this.setState({password: text}) }
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}>
          </TextInput>
          <TouchableHighlight onPress={this.onLoginPressed.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>
              Login
            </Text>
          </TouchableHighlight>

          <Text style={styles.error}>
            {this.state.error}
          </Text>
      </View>
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
    paddingTop: 80
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  button: {
    height: 50,
    backgroundColor: '#006600',
    alignSelf: 'stretch',
    marginTop: 10,
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  heading: {
    fontSize: 30,
  },
  error: {
    color: 'red',
    paddingTop: 10
  },
  success: {
    color: 'green',
    paddingTop: 10
  },
  loader: {
    marginTop: 20
  },
  toolbar: {
    backgroundColor: '#006699',
    height: 60
  },
  wraper: {
    flex: 1,
  },
  backChevron: {

  },
  buttons: {

  },
  leftButtonHolder: {

  },
  mediumText: {

  },
  navBarText:{

  }

});

export default Login
