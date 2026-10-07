export function validateAuth(values, isRegister) {
  const errors = {}
  if (isRegister && values.name.trim().length < 2) errors.name = 'Informe seu nome com pelo menos 2 caracteres.'
  if (!values.email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Digite um e-mail válido, como voce@exemplo.com.'
  }
  if (!values.password) {
    errors.password = 'Informe sua senha.'
  } else if (isRegister && values.password.length < 8) {
    errors.password = 'Use pelo menos 8 caracteres para a senha.'
  }
  if (isRegister && !values.confirmPassword) {
    errors.confirmPassword = 'Confirme sua senha.'
  } else if (isRegister && values.confirmPassword !== values.password) {
    errors.confirmPassword = 'As senhas precisam ser iguais.'
  }
  return errors
}
