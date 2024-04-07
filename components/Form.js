import { View, StyleSheet } from 'react-native';
import InputField from './InputField';

const Form = ({ fields, values, setData, extraComponent }) => (
  <View style={styles.form}>
    {fields.map((field) => (
      <InputField
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        value={values ? values[field.key] : ''}
        onChangeText={(text) => setData(field.key, text)}
        secureTextEntry={field.secureTextEntry}
      />
    ))}
    {extraComponent}
  </View>
);

const styles = StyleSheet.create({
  form: {
    width: '100%',
    gap: 20,
  }
})

export default Form;