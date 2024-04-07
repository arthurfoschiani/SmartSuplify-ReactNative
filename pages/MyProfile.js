import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import firebase from 'firebase';
import Form from '../components/Form';

const windowWidth = Dimensions.get('window').width;

const updateUserDataFields = [
  { key: 'nome', label: 'Nome Completo', placeholder: 'Gustavo Ferreira' },
  { key: 'email', label: 'Email', placeholder: 'gustavo.ferreira@gmail.com' },
];

const updateSenhaFields = [
  { key: 'senhaAtual', label: 'Senha atual', placeholder: '**********', secureTextEntry: true },
  { key: 'senha', label: 'Nova Senha', placeholder: '**********', secureTextEntry: true },
  { key: 'confirmarSenha', label: 'Confirmar Senha', placeholder: '**********', secureTextEntry: true },
];

const MyProfile = ({ route }) => {
  const { db, logOffUser, auth } = route.params;
  const currentUser = auth.currentUser;
  const [dataUser, setDataUser] = useState({
    nome: '',
    email: '',
    empresa: '',
    senhaAtual: '',
    senha: '',
    confirmarSenha: '',
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

  const updateUserInDataBase = () => {
    const { nome, email } = dataUser;

    if (
      !/^[a-zA-Z0-9._+]+@[a-zA-Z0-9_]+\.[a-zA-Z]{2,}(?:\.[a-zA-Z]{2})?$/.test(
        email
      )
    ) {
      alert('Por favor, insira um email válido.');
      return;
    }

    db.ref(`users/${currentUser.uid}`)
      .update({
        nomeCompleto: nome,
        email: email,
      })
      .then(() => {
        alert('Seus dados foram atualizados com sucesso!');
      })
      .catch((error) => {
        alert('Não foi possível atualizar seus dados.');
      });
  };

  const changePassword = async () => {
    const { senhaAtual, senha, confirmarSenha } = dataUser;

    if (!senha || !confirmarSenha || !senhaAtual) {
      alert('Todos os campos são obrigatórios.');
      return;
    }

    const isReauthenticated = await reauthenticate(senhaAtual);
    if (!isReauthenticated) {
      alert('Senha atual incorreta.');
      return;
    }

    if (senha === senhaAtual) {
      alert('A nova senha deve ser diferente da atual.');
      return;
    }

    if (senha.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (senha !== confirmarSenha) {
      alert('As senhas não são idênticas.');
      return;
    }

    currentUser
      .updatePassword(senha)
      .then(() => {
        alert('Senha atualizada com sucesso!');
      })
      .catch((error) => {
        alert('Falha ao atualizar senha. Tente novamente mais tarde.');
      });
  };

  const reauthenticate = async (currentPassword) => {
    var cred = firebase.auth.EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    try {
      await currentUser.reauthenticateWithCredential(cred);
      return true;
    } catch (error) {
      return false;
    }
  };

  const deleteAccount = () => {
    Alert.alert(
      'Deletar Conta',
      'Tem certeza de que deseja deletar sua conta? Esta ação é irreversível e todos os seus dados serão perdidos.',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancelado'),
          style: 'cancel',
        },
        { text: 'Deletar', onPress: () => confirmDeleteAccount() },
      ],
      { cancelable: false }
    );
  };

  const confirmDeleteAccount = () => {
    db.ref(`users/${currentUser.uid}`)
      .remove()
      .then(() => {
        currentUser
          .delete()
          .then(() => {
            alert('Conta deletada com sucesso.');
          })
          .catch((error) => {
            alert('Erro ao deletar conta. Tente novamente mais tarde.');
          });
      })
      .catch((error) => {
        alert('Erro ao remover dados do usuário.');
      });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView style={styles.container}>
        <View style={styles.modalLogin}>
          <UpdateUserData
            dataUser={dataUser}
            setDataUser={setDataUser}
            updateUserInDataBase={updateUserInDataBase}
          />
          <UpdateSenha
            setDataUser={setDataUser}
            dataUser={dataUser}
            changePassword={changePassword}
          />

          <View style={styles.dangerButtons}>
            <TouchableOpacity style={styles.button} onPress={logOffUser}>
              <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteAccount}>
              <Text style={styles.linkText}>Deletar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const UpdateUserData = ({ dataUser, setDataUser, updateUserInDataBase }) => (
  <Form
    fields={updateUserDataFields}
    values={dataUser}
    setData={(key, value) => {
      setDataUser((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }}
    extraComponent={
      <>
        <Text style={{ color: '#fff' }}>Empresa: {dataUser.empresa}</Text>
        <TouchableOpacity style={styles.button} onPress={updateUserInDataBase}>
          <Text style={styles.buttonText}>Atualizar Dados</Text>
        </TouchableOpacity>
      </>
    }
  />
);

const UpdateSenha = ({ setDataUser, changePassword, dataUser }) => (
  <Form
    fields={updateSenhaFields}
    setData={(key, value) => {
      setDataUser((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    }}
    values={dataUser}
    extraComponent={
      <TouchableOpacity style={styles.button} onPress={changePassword}>
        <Text style={styles.buttonText}>Atualizar Senha</Text>
      </TouchableOpacity>
    }
  />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#000',
    width: '100%',
  },
  safeAreaView: {
    flex: 1,
    width: '100%',
    backgroundColor: '#000',
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
  },
  button: {
    width: '100%',
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
  },
  dangerButtons: {
    width: '100%',
    gap: 15,
  },
  linkText: {
    textAlign: 'center',
    color: '#FF0000',
  },
});

export default MyProfile;
