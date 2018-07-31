import React from 'react';
import { Ionicons, MaterialIcons, Foundation, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Image, Platform, ScrollView, StyleSheet, Text, Button, TouchableOpacity, View } from 'react-native';
import { Camera, Permissions, FileSystem } from 'expo';
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
  };
  
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };
  
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  
  takePicture = () => {    
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this.onPictureSaved });
    }
  };
  
  onPictureSaved = async photo => {
    await FileSystem.moveAsync({
      from: photo.uri,
      to: `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`,
    });
    this.setState({ newPhotos: true });
  }
  
  render() {
    
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
        <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }}>
        </Camera>
        
        <View style={styles.tabBarInfoContainer}>
            <Button onPress={() => {
              this.setState({
                type: this.state.type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front : Camera.Constants.Type.back,});
              }} title="Flip" color="#efefef" accessibilityLabel="Learn more about this purple button"/>
              
              <Button onPress={this.takePicture} title="Snap" color="#ededed" accessibilityLabel="Learn more about this purple button"/>
          </View>
          </View>
          
        )};
        
      }
      
      _maybeRenderDevelopmentModeWarning() {
        if (__DEV__) {
          const learnMoreButton = (
            <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
            Learn more
            </Text>
          );
          
          return (
            <Text style={styles.developmentModeText}>
            Development mode is enabled, your app will be slower but you can use useful development
            tools. {learnMoreButton}
            </Text>
          );
        } else {
          return (
            <Text style={styles.developmentModeText}>
            You are not in development mode, your app will run at full speed.
            </Text>
          );
        }
      }
      
      _handleLearnMorePress = () => {
        WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
      };
      
      _handleHelpPress = () => {
        WebBrowser.openBrowserAsync(
          'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
        );
      };
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      developmentModeText: {
        marginBottom: 20,
        color: 'rgba(0,0,0,0.4)',
        fontSize: 14,
        lineHeight: 19,
        textAlign: 'center',
      },
      contentContainer: {
        paddingTop: 30,
      },
      welcomeContainer: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
      },
      welcomeImage: {
        width: 100,
        height: 80,
        resizeMode: 'contain',
        marginTop: 3,
        marginLeft: -10,
      },
      getStartedContainer: {
        alignItems: 'center',
        marginHorizontal: 50,
      },
      homeScreenFilename: {
        marginVertical: 7,
      },
      codeHighlightText: {
        color: 'rgba(96,100,109, 0.8)',
      },
      codeHighlightContainer: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 3,
        paddingHorizontal: 4,
      },
      getStartedText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        lineHeight: 24,
        textAlign: 'center',
      },
      tabBarInfoContainer: {
        flex : 1, 
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        ...Platform.select({
          ios: {
            shadowColor: 'black',
            shadowOffset: { height: -3 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
          },
          android: {
            elevation: 20,
          },
        }),
        alignItems: 'stretch',
        backgroundColor: '#fbfbfb',
        paddingVertical: 20,
      },
      tabBarInfoText: {
        fontSize: 17,
        color: 'rgba(96,100,109, 1)',
        textAlign: 'center',
      },
      navigationFilename: {
        marginTop: 5,
      },
      helpContainer: {
        marginTop: 15,
        alignItems: 'center',
      },
      helpLink: {
        paddingVertical: 15,
      },
      helpLinkText: {
        fontSize: 14,
        color: '#2e78b7',
      },
    });
    