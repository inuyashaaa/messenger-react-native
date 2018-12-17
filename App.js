import { createStackNavigator, createAppContainer } from 'react-navigation';
import { Sentry } from 'react-native-sentry';
import Screens from './app/screens/Screens';


Sentry.config('https://e1de8630dda94342a2ab62855bb5993e@sentry.io/1342423').install();


const StackApp = createStackNavigator(Screens, {
  mode: 'modal',
  headerMode: 'none',
});

export default createAppContainer(StackApp);
