import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const authHeader = req.headers.authorization;

  // Log the received header
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: "No token" });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  // Log the extracted token
  console.log("Extracted token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Decoded token:", decoded); // optional, shows user id & role
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ msg: "Invalid token" });
  }
}
