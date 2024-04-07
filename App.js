import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import MyProfile from './pages/MyProfile';
import Welcome from './pages/Welcome';

const config = {
  apiKey: 'AIzaSyBRf5WgswhC_LDmXN41i4PnIl1LnWHkczU',
  authDomain: 'smartsuplify.firebaseapp.com',
  projectId: 'smartsuplify',
  databaseURL: 'smartsuplify-default-rtdb.firebaseio.com/',
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const Stack = createStackNavigator();

const App = () => {
  const [logado, setLogado] = useState(null);
  const [newUser, setNewUser] = useState(false);

  const auth = firebase.auth();
  const db = firebase.database();

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [auth]);

  const onAuthStateChanged = (user) => {
    setLogado(user);
  };

  logOffUser = async () => {
    auth
      .signOut()
      .then(() => setNewUser(false))
      .catch((error) => console.log(error));
  };

  if (logado) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Bem-Vindo" component={Welcome} initialParams={{ db: db, logOffUser: logOffUser, auth: auth }}></Stack.Screen>
          <Stack.Screen name="Meu Perfil" component={MyProfile} initialParams={{ db: db, logOffUser: logOffUser, auth: auth }}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else if (newUser) {
    return <SignUp db={db} setLogado={setLogado} auth={auth} setNewUser={setNewUser} />;
  } else {
    return <Login setLogado={setLogado} auth={auth} setNewUser={setNewUser} />;
  }
};

export default App;
