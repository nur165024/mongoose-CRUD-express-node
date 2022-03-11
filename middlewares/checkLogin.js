const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization);

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, phone, name } = decoded;
    req.userId = userId;
    req.name = name;
    req.phone = phone;
    next();
  } catch (error) {
    console.log(error.message);
    next("Authentication failure");
  }
};

module.exports = checkLogin;
