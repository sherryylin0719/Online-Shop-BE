const isValidPassword = password => {
  const lowercaseRegex = /[a-z]/;
  const uppercaseRegex = /[A-Z]/;
  const digitRegex = /[0-9]/;
  const specialCharRegex = /[!@#$%^&*]/;

  // check if password fulfills all requirement
  const hasLowercase = lowercaseRegex.test(password);
  const hasUppercase = uppercaseRegex.test(password);
  const hasDigit = digitRegex.test(password);
  const hasSpecialChar = specialCharRegex.test(password);

  // return true when password matches all requirement
  return hasLowercase && hasUppercase && hasDigit && hasSpecialChar;
}

const isValidEmail = email => { 
  const emailRegex = /^[\w-\.%+-]+@([\w-]+\.)+[a-zA-Z]{2,}$/; 
  return emailRegex.test(email)
}

module.exports = {
  isValidPassword,
  isValidEmail
}