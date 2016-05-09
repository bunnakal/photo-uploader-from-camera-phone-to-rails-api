
'use strict';
import React, {
  Component,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
  ActivityIndicatorIOS,
  Text,
  View,
  ToolbarAndroid
} from 'react-native';

var Icon = require('react-native-vector-icons/Ionicons');

const API_URL = 'http://192.168.1.126:3000';
const ACCESS_TOKEN = 'access_token';

class Register extends Component {
  constructor(){
    super();

    this.state = {
      email: "",
      name: "",
      password: "",
      password_confirmation: "",
      errors: [],
      showProgress: false,
    }
  }
  redirect(routeName, accessToken){
    this.props.navigator.push({
      name: routeName
    });
  }

  async storeToken(accessToken) {
    try {
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
        console.log("Token was stored successfull ");
    } catch(error) {
        console.log("Something went wrong");
    }
  }
  async onRegisterPressed() {
    this.setState({showProgress: true})
    try {
      let response = await fetch(API_URL + '/api/users', {
                              method: 'POST',
                              headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify({
                                user:{
                                  name: this.state.name,
                                  email: this.state.email,
                                  password: this.state.password,
                                  password_confirmation: this.state.password_confirmation,
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
    } catch(errors) {
      //errors are in JSON form so we must parse them first.
      let formErrors = JSON.parse(errors);
      //We will store all the errors in the array.
      let errorsArray = [];
      for(var key in formErrors) {
        //If array is bigger than one we need to split it.
        if(formErrors[key].length > 1) {
            formErrors[key].map(error => errorsArray.push(`${key} ${error}`));
        } else {
            errorsArray.push(`${key} ${formErrors[key]}`);
        }
      }
      this.setState({errors: errorsArray})
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
          title="Register"
          navIconName="android-arrow-back"
          titleColor="white"
          onIconClicked={this.backButton.bind(this)}
          style={styles.toolbar}
         />
        <View style={styles.container}>
          <Text style={styles.heading}>
            Join us now!
          </Text>
          <TextInput
            onChangeText={ (text)=> this.setState({email: text}) }
            style={styles.input} placeholder="Email">
          </TextInput>
          <TextInput
            onChangeText={ (text)=> this.setState({name: text}) }
            style={styles.input} placeholder="Name">
          </TextInput>
          <TextInput
            onChangeText={ (text)=> this.setState({password: text}) }
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}>
          </TextInput>
          <TextInput
            onChangeText={ (text)=> this.setState({password_confirmation: text}) }
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}>
          </TextInput>
          <TouchableHighlight onPress={this.onRegisterPressed.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>
              Register
            </Text>
          </TouchableHighlight>

          <Errors errors={this.state.errors}/>
        </View>
      </View>
    );
  }
}

const Errors = (props) => {
  return (
    <View>
      {props.errors.map((error, i) => <Text key={i} style={styles.error}> {error} </Text>)}
    </View>
  );
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
    backgroundColor: '#680000',
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
  loader: {
    marginTop: 20
  },
  toolbar: {
    backgroundColor: '#006699',
    height: 60
  },
  wraper: {
    flex: 1,
  }
});

export default Register
