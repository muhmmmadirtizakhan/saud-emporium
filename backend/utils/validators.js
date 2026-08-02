  // Input validation helpers - Future use ke liye

  exports.isValidEmail = (email) => {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

  exports.isValidPhone = (phone) => {
    const re = /^[0-9]{10,15}$/;
    return re.test(phone);
  };

  exports.isValidPassword = (password) => {
    return password && password.length >= 6;
  };