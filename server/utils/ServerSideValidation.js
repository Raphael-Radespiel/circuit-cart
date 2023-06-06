// THIS IS NOT HOW SECURE VALIDATION WORKS!

function validateEmail(email){
  // Test Email
  const emailRegex = /^\S+@\S+\.\S+$/;

  if(!emailRegex.test(email)){
    console.log("Invalid EMAIL");
    throw new Error("Invalid Email")
  }
    console.log("VALID EMAIL");
}

function validatePassword(password){
  if(password.length < 8){
    throw new Error("Invalid Password, smaller than 8 characters")
  }

  if(password.length > 16){
    throw new Error("Invalid password, longer than 16 characters");
  }
}

function validateSignupForm(data){
  // Test Email
  validateEmail(data.email);

  // Test password
  validatePassword(data.password);
}

module.exports = { validateSignupForm, validateEmail };
