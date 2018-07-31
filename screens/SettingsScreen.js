import React from 'react';
import { ExpoConfigView } from '@expo/samples';
import { Permissions, Notifications } from 'expo';

export default class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'app.json',
  };

  state = {
    notification: {},
  };

  constructor(props) { 
    super(props);    
  }

  async componentDidMount() {
    this.registerForPushNotificationsAsync();

    this._notificationSubscription = Notifications.addListener(this._handleNotification);
    
  }

  _handleNotification = (notification) => {
    this.setState({notification: notification});
    
    console.log('getting this from server');
    console.log(notification);
  };
  
  
  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return <ExpoConfigView />;
  }


  async registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    console.log('getting token');
    console.log(token);
  
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    return fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: {
          value: token,
        },
        user: {
          username: 'Brent',
        },
      }),
    });
  }





}
