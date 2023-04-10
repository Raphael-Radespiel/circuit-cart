function validateEmail(email){
  // Test Email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if(!emailRegex.test(email)){
    console.log("Sorry, invalid email");
    return false;
  }

  return true;
}

function validatePassword(password){
  if(password.length < 8){
    console.log("Sorry, password needs to be 8 or longer");
    return false;
  }

  if(password.length > 16){
    console.log("Sorry, password is longer than 16 characters");
    return false;
  }

  return true;
}

function validateSignupForm(data){
  // Test Name
  if(data.fullName == ""){
    console.log("Sorry, your name is not an empty string");
    return false;
  }

  // Test Email
  if(!validateEmail(data.email)) return false;

  // Test password
  if(!validatePassword(data.password)) return false;

  if(data.password != data.confirmedPassword){
    console.log("Your password and confirmed password are not the same");
    return false;
  }

  return true;
}

function validateLoginForm(data){
  // Test Email
  if(!validateEmail(data.email)) return false;

  // Test password
  if(!validatePassword(data.password)) return false;

  return true;
}


module.exports = {validateLoginForm, validateSignupForm, validateEmail};
