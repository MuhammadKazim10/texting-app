const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const PORT = 5000;
require("dotenv").config();
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).send("Access denied");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
}

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection Successful"))
  .catch((error) => {
    console.log("Error connecting to database", error);
  });

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.post("/createUser", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    username: username,
    password: hashedPassword,
    friends: [],
    online: false,
  });
  newUser
    .save()
    .then(() => console.log("User created successfully"))
    .catch((error) => console.log("User not created"));
  res.status(200).send("User created successfully");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }
    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      return res.status(401).send("Invalid Credentials");
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.log("ERROR");
    res.status(500).send("Login Failed");
  }
});

app.get("/home", authenticateToken, (req, res) => {
  res.send("You have logged in");
});

app.all("*", (req, res) => {
  res.send("Hello");
});
