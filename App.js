import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Sentry } from 'react-native-sentry';
import { YellowBox } from 'react-native';
import Screens from './app/screens/Screens';

if (!__DEV__) {
  Sentry.config('https://e1de8630dda94342a2ab62855bb5993e@sentry.io/1342423').install();
}

const socketWarning = 'Setting a timer for a long period of time, i.e. multiple minutes, '
 + 'is a performance and correctness issue on Android as it keeps the timer module awake, '
 + 'and timers can only be called when the app is in the foreground. '
 + 'See https://github.com/facebook/react-native/issues/12981 for more info.\n'
 + '(Saw setTimeout with duration 85000ms)';

const unrecognizedWebSocket = 'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, '
 + '`passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. '
 + 'Did you mean to put these under `headers`?';

YellowBox.ignoreWarnings([
  'Warning: isMounted',
  'Module RCTImageLoader',
  'Class RCTC',
  'Remote debugger',
  socketWarning, // socker.io pingInterval + pingTimeout
  unrecognizedWebSocket, // socket.io Unrecognized
]);

const StackApp = createStackNavigator(Screens, {
  mode: 'modal',
  headerMode: 'none',
});

export default createAppContainer(StackApp);
