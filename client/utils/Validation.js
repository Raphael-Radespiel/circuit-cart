function validateEmail(email){
  // Test Email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if(!emailRegex.test(email)){
    throw new Error("Invalid email address");
  }
}

function validatePassword(password){
  if(password.length < 8){
    throw new Error("Password needs to be 8 characters or longer");
  }

  if(password.length > 16){
    throw new Error("Password is longer than 16 characters");
  }
}

function validateSignupForm(data){
  try{
    // Test Email
    validateEmail(data.email);
    // Test password
    validatePassword(data.password);
  }
  catch(error){
    throw error;
  }

  if(data.password != data.confirmedPassword){
    throw new Error("Your password and confirmed password are not the same");
  }
}

function validateLoginForm(data){
  try{
    // Test Email
    validateEmail(data.email);
    // Test password
    validatePassword(data.password);
  }
  catch(error){
    throw error;
  }
}


export {validateLoginForm, validateSignupForm};
