import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useState } from 'react';
import InputField from '../components/InputField';
import Form from '../components/Form';

const loginFields = [
  { key: 'email', label: 'Email', placeholder: 'gustavo.ferreira@gmail.com' },
  {
    key: 'senha',
    label: 'Senha',
    placeholder: '**********',
    secureTextEntry: true,
  },
];

const Login = ({ setLogado, auth, setNewUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const logUser = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => setLogado(user))
      .catch((error) => {
        let errorMessage;
        try {
          const errorObject = JSON.parse(error.message);
          errorMessage = errorObject.error.message;
        } catch (e) {
          errorMessage = error.message;
        }
        alert(errorMessage);
      });
  };

  const showConfirmationAlert = () => {
    Alert.alert(
      'Confirmação',
      'Você deseja realizar esta ação?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          onPress: () => console.log('Confirmado'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <HeaderSection />
      <LoginSection
        logUser={logUser}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        showConfirmationAlert={showConfirmationAlert}
        setNewUser={setNewUser}
      />
    </View>
  );
};

const HeaderSection = () => (
  <View style={styles.backgroundTheme}>
    <View style={styles.textsHeader}>
      <Text style={styles.title}>SmartSuplify</Text>
      <Text style={styles.subtitle}>
        Acesse sua conta para ter controle de seu estoque
      </Text>
    </View>
  </View>
);

const LoginSection = ({
  logUser,
  email,
  setEmail,
  password,
  setPassword,
  showConfirmationAlert,
  setNewUser,
}) => (
  <View style={styles.modalLogin}>
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
    />
    <TouchableOpacity
      style={styles.button}
      onLongPress={showConfirmationAlert}
      onPress={logUser}>
      <Text style={styles.buttonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setNewUser(true)}>
      <Text style={styles.footerText}>
        Não possui uma conta? <Text style={styles.textBold}>Cadastre-se</Text>
      </Text>
    </TouchableOpacity>
  </View>
);

const LoginForm = ({ email, setEmail, password, setPassword }) => (
  <Form
    fields={loginFields}
    values={{ email: email, senha: password }}
    setData={(key, value) => {
      if (key === 'email') {
        setEmail(value);
      } else if (key === 'senha') {
        setPassword(value);
      }
    }}
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#143040',
    width: '100%',
  },

  backgroundTheme: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#143040',
    padding: 30,
    textAlign: 'center',
    width: '100%',
  },
  textsHeader: {
    textAlign: 'center',
    marginTop: 70,
  },
  title: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#A5A5A5',
    marginBottom: 30,
  },

  modalLogin: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    textAlign: 'center',
    gap: 40,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#143040',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  footerText: {
    color: '#fff',
    marginTop: -20,
  },
  textBold: {
    color: '#fff',
    fontWeight: 800,
  },
});

export default Login;
