const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Secure 6 digit code string
};

export default generateOTP;
