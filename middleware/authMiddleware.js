// last working code:
// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   // Get the token from the Authorization header
//   const token = req.header("Authorization");

//   // Check if token is provided
//   if (!token || !token.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "No token, authorization denied" });
//   }

//   try {
//     // Extract the token (remove the "Bearer " part)
//     const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
//     req.user = decoded; // Attach the decoded user data to the request object
//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     console.error(err);
//     return res.status(401).json({ message: "Token is not valid" });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization");

  // Check if token is provided
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    // Extract the token (remove the "Bearer " part)
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user data, including role, to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
