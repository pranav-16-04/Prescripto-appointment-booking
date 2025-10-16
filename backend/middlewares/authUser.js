import jwt from 'jsonwebtoken'

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ success: false, message: "Not Authorized, Login Again" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure req.body exists
    if (!req.body) req.body = {};

    // Assign userId as a string, not an object
    req.body.userId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authUser;
