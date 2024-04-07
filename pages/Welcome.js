import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableHighlight
} from 'react-native';
import { useState, useEffect } from 'react';

const windowWidth = Dimensions.get('window').width;

const Welcome = ({ route, navigation }) => {
  const { db, logOffUser, auth } = route.params;
  const [dataUser, setDataUser] = useState({
    nome: '',
    email: '',
    empresa: '',
  });

  useEffect(() => {
    getUserFromDataBase();
  }, []);

  getUserFromDataBase = () => {
    const currentUser = auth.currentUser;

    db.ref(`users/${currentUser.uid}`).once('value', (snapshot) => {
      setDataUser({
        nome: snapshot.val().nomeCompleto,
        email: snapshot.val().email,
        empresa: snapshot.val().empresa,
      });
    });
  };

  return(
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        {
          dataUser.nome && <Text style={styles.text} >Bem vindo (a), {dataUser.nome}</Text>
        }
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate('Meu Perfil')}>
          <Text style={styles.buttonText}>Ir para meu perfil</Text>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  container: {
    backgroundColor: '#000',
    width: '100%',
    height: '100%',
    gap: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#FFF'
  },
  button: {
    width: '80%',
    padding: 15,
    paddingVertical: 12,
    backgroundColor: '#143040',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  }
});

export default Welcome;