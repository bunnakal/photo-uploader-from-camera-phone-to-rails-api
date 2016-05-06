'use strict';
import React, {
  Component,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ActivityIndicatorIOS,
  AsyncStorage,
  Alert,
  Text,
  View,
  ScrollView,
  Platform,
  Image,
  PixelRatio,
  ToolbarAndroid,
  DrawerLayoutAndroid
} from 'react-native';

var ImagePickerManager = require('NativeModules').ImagePickerManager;

const API_URL = 'http://192.168.1.126:3000';
const ACCESS_TOKEN = 'access_token';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      isLoggenIn: "",
      showProgress: false,
      accessToken: "",
      imageSource: []
    }
  }

  componentWillMount() {
    this.getToken();
  }
  async getToken() {
    try {
      let accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      if(!accessToken) {
          this.redirect('login');
      } else {
          this.setState({accessToken: accessToken})
      }
    } catch(error) {
        console.log("Something went wrong");
        this.redirect('login');
    }
  }
  async deleteToken() {
    try {
        await AsyncStorage.removeItem(ACCESS_TOKEN)
        this.redirect('root');
    } catch(error) {
        console.log("Something went wrong");
    }
  }
  redirect(routeName){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        accessToken: this.state.accessToken
      }
    });
  }
  onLogout(){
    this.setState({showProgress: true})
    this.deleteToken();
  }

  confirmDelete() {
    Alert.alert("Are you sure?", "This action cannot be undone", [
      {text: 'Cancel'}, {text: 'Delete', onPress: () => this.onDelete()}
    ]);
  }

  async onDelete(){
    let access_token = this.state.accessToken
    try {
      let response = await fetch(API_URL+ '/api/users/'+access_token,{
                              method: 'DELETE',
                            });
        let res = await response.text();
        if (response.status >= 200 && response.status < 300) {
          console.log("success sir: " + res)
          this.redirect('root');
        } else {
          let error = res;
          throw error;
        }
    } catch(error) {
        console.log("error: " + error)
    }
  }

  selectPhotoTapped() {
    const options = {
      title: 'Photo Picker',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      storageOptions: {
        skipBackup: true,
        path: 'disk',
        savePrivate: true
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        // You can display the image using either:
        //const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        var source;
        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }
        this.setState({
          imageSource: this.state.imageSource.concat(source)
        });
      }
    });
  }

  saveImages(){

    //upload by using fetch
    let formdata = new FormData();
    formdata.append("property[title]", String(this.state.title));
    formdata.append("property[description]", String(this.state.description));
    formdata.append("property[latitude]", String(this.state.latitude));
    formdata.append("property[longitude]", String(this.state.longitude));
    this.state.imageSource.map(function(imageselected,key){
      formdata.append("property[property_images_attributes[" + key +"][image]]", {uri: imageselected.uri, name: new Date().getTime() + '.jpg', type: 'multipart/form-data'});
    });

    fetch(API_URL + '/api/create', {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formdata
    }).then(response => {
      console.log("image uploaded")
      console.log(response)
    }).catch(err => {
      console.log(err)
    });

  }

  openDrawer() {
    this.refs['DRAWER'].openDrawer()
  }

  render() {
    //We check to se if there is a flash message. It will be passed in user update.
    let flashMessage;
    var _scrollView: ScrollView;
    if (this.props.flash) {
       flashMessage = <Text style={styles.flash}>{this.props.flash}</Text>
    } else {
       flashMessage = null
    }
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image
          style={styles.icon}
          source={require('./assets/bunnakal.png')}
        />
        <Text style= {styles.loggedName}>Bunna KAL</Text>
        <TouchableHighlight onPress={this.onLogout.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Logout
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.redirect.bind(this, 'update')} style={styles.button}>
          <Text style={styles.buttonText}>
            Update Account
          </Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.confirmDelete.bind(this)} style={styles.button}>
          <Text style={styles.buttonText}>
            Delete Account
          </Text>
        </TouchableHighlight>
      </View>
    );
    return(
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={'DRAWER'}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={styles.wraper}>
          <ToolbarAndroid
            title="Photo Uploader"
            navIcon={require("./assets/fa-bars_converted.png")}
            titleColor="white"
            onIconClicked={this.openDrawer.bind(this)}
            style={styles.toolbar}
          />
          <ScrollView
            ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            onScroll={() => { console.log('onScroll!'); }}
            scrollEventThrottle={200}
          >
            {flashMessage}
              <View style={styles.formContainer}>
                <TextInput
                  onChangeText={ (title)=> this.setState({title}) }
                  value={this.state.title}
                  style={styles.input}
                  placeholder="Title">
                </TextInput>
                <TextInput
                  onChangeText={ (description)=> this.setState({description}) }
                  value={this.state.description}
                  style={styles.input}
                  placeholder="Description">
                </TextInput>
                <TextInput
                  onChangeText={ (latitude)=> this.setState({latitude}) }
                  value={this.state.latitude}
                  style={styles.input}
                  placeholder="Latitude">
                </TextInput>
                <TextInput
                  onChangeText={ (longitude)=> this.setState({longitude}) }
                  value={this.state.longitude}
                  style={styles.input}
                  placeholder="Longitude">
                </TextInput>
                {
                this.state.imageSource.map(function(imageselected,key){
                  return(
                    <View key={key++} style={[styles.image, styles.imageContainer, {marginBottom: 20}]}>
                      <Image style={styles.image} source={imageselected} />
                    </View>
                  )
                })
              }
              <TouchableHighlight onPress={ this.selectPhotoTapped.bind(this) } style={styles.buttonSelect}>
                <Text style={styles.buttonText}>Select Photo</Text>
              </TouchableHighlight>
              <TouchableHighlight style={styles.buttonUpload} onPress={ this.saveImages.bind(this) }>
                <Text style={styles.buttonText}>Upload</Text>
              </TouchableHighlight>
              </View>
          </ScrollView>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    height: 400,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5f9ea0'
  },
  title: {
    fontSize: 25,
    marginTop: 15,
    marginBottom: 15
  },
  text: {
    marginBottom: 30
  },
  button: {
    height: 50,
    backgroundColor: '#808080',
    alignSelf: 'stretch',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    alignItems: 'flex-end',
    padding: 10
  },
  buttonSelect: {
    height: 50,
    backgroundColor: '#006600',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 10
  },
  buttonUpload: {
    height: 50,
    backgroundColor: '#680000',
    alignSelf: 'stretch',
    marginTop: 10,
    alignItems: 'flex-end',
    justifyContent: 'center',
    padding: 10
  },
  buttonText: {
    fontSize: 22,
    color: '#FFF',
    alignSelf: 'center'
  },
  loggedName: {
    fontSize: 22,
    color: '#00F',
    alignSelf: 'center'
  },
  input: {
    height: 50,
    marginTop: 10,
    padding: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48bbec'
  },
  flash: {
    height: 40,
    backgroundColor: '#00ff00',
    padding: 10,
    alignSelf: 'center',
  },
  loader: {
    marginTop: 20
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
  wraper: {
    flex: 1,
  },
  formContainer:{
    flexDirection: 'column',
    margin: 10
  },
  image: {
    flex: 1,
    height: 300
  },
  imageContainer: {
    backgroundColor: '#F5FCFF',
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    margin: 5,
    flex: 1
  },
  containerImage: {
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'flex-start'
  },
  toolbar: {
    backgroundColor: '#006699',
    height: 60
  },
  icon: {
    borderRadius: 65,
    width: 80,
    height: 80,
    marginTop: 15,
    marginBottom: 15,
    alignSelf: 'center'
  }
});

export default Home
