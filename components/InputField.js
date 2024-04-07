import {
  View,
  Text,
  StyleSheet,
  TextInput
} from 'react-native';

const InputField = ({ label, placeholder, ...props }) => (
  <View style={styles.inputSpace}>
    <Text style={styles.labelInput}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#727272"
      {...props}
    />
  </View>
);

const styles = StyleSheet.create({
  inputSpace: {
    gap: 4,
    width: '100%',
  },
  labelInput: {
    fontSize: 16,
    textAlign: 'start',
    color: '#FFF',
    marginBottom: 10,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#111111',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#FFF',
  }
})

export default InputField;