import jwt from 'jsonwebtoken';

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization || req.params.token;
  if (!token) {
    res.status(401).json({ error: 'Please log in or Register' });
  } else {
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        return res.status(403).json({ error: `${error.message}` });
      }
      req.userData = decoded;
      next();
    });
  }
};

export default verifyToken;
