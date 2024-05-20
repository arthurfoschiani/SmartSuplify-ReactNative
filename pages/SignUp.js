import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';
import { useState } from 'react';
import Form from '../components/Form';

const windowWidth = Dimensions.get('window').width;

const signUpFields = [
  { key: 'nome', label: 'Nome Completo', placeholder: 'Gustavo Ferreira' },
  { key: 'email', label: 'Email', placeholder: 'gustavo.ferreira@gmail.com' },
  { key: 'senha', label: 'Senha', placeholder: '**********', secureTextEntry: true },
  { key: 'confirmarSenha', label: 'Confirmar Senha', placeholder: '**********', secureTextEntry: true },
  { key: 'empresa', label: 'Empresa', placeholder: 'Level Group' },
];

const SignUp = ({ setLogado, auth, setNewUser, db }) => {
  const [dataUser, setDataUser] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    empresa: '',
  });

  const createUser = async () => {
    const { nome, email, senha, confirmarSenha, empresa } = dataUser;

    if (!nome || !email || !senha || !confirmarSenha || !empresa) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não são idênticas.');
      return;
    }

    if (
      !/^[a-zA-Z0-9._+]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/.test(
        email
      )
    ) {
      Alert.alert('Erro', 'Por favor, insira um email válido.');
      return;
    }

    try {
      const user = await auth.createUserWithEmailAndPassword(email, senha);
      setLogado(user);
      await saveUserToDataBase(nome, email, empresa, user.user.uid);
    } catch (error) {
      let errorMessage;
      try {
        const errorObject = JSON.parse(error.message);
        errorMessage = errorObject.error.message;
      } catch (e) {
        errorMessage = error.message;
      }
      Alert.alert('Falha ao Cadastrar', errorMessage, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tentar Novamente', onPress: () => createUser() }
      ]);
    }
  };

  const saveUserToDataBase = async (nome, email, empresa, uid) => {
    try {
      await db.ref(`users/${uid}`).set({
        nomeCompleto: nome,
        email: email,
        empresa: empresa,
      });
    } catch (error) {
      Alert.alert('Erro de Banco de Dados', 'Não foi possível salvar os dados do usuário.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Tentar Novamente', onPress: () => saveUserToDataBase(nome, email, empresa, uid) }
      ]);
    }
  };

  const handleSetData = (key, value) => {
    setDataUser((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.container}>
        <HeaderSection />
        <SignUpSection
          handleSetData={handleSetData}
          createUser={createUser}
          setNewUser={setNewUser}
          dataUser={dataUser}
        />
      </ScrollView>
    </SafeAreaView>
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

const SignUpSection = ({ handleSetData, createUser, setNewUser, dataUser }) => (
  <View style={styles.modalLogin}>
    <SignUpForm handleSetData={handleSetData} dataUser={dataUser} />
    <TouchableOpacity style={styles.button} onPress={createUser}>
      <Text style={styles.buttonText}>Cadastrar</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setNewUser(false)}>
      <Text style={styles.footerText}>
        Já possui uma conta? <Text style={styles.textBold}>Entre aqui</Text>
      </Text>
    </TouchableOpacity>
  </View>
);

const SignUpForm = ({ handleSetData, dataUser }) => (
  <Form fields={signUpFields} values={dataUser} setData={handleSetData} />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#143040',
    width: '100%',
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#143040',
  },

  backgroundTheme: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#143040',
    padding: 30,
    paddingBottom: 50,
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingVertical: 50,
    paddingHorizontal: 30,
    textAlign: 'center',
    gap: 40,
    width: windowWidth,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
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
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    width: '100%',
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

export default SignUp;
