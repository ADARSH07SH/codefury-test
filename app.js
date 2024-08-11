// Import required modules
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const ejsMate = require("ejs-mate");

const app = express();
const port = 8000; // You can set this to any desired port

const connection = mysql.createConnection({
  host: "mysql-2e295e01-noob-8b4e.k.aivencloud.com",
  user: "avnadmin",
  database: "defaultdb",
  password: "AVNS_a4Q4yFt1nVXs8YrHqVD",
  port: 11699,
});

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static("views"));


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/`);
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.message);
    return;
  }
  console.log("Connected to the database.");
});

// Routes
app.get("/", (req, res) => {
  res.render("./file/home.ejs");
});

app.get("/login", (req, res) => {
  res.render("./file/signin");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Verify user credentials
  const sql = "SELECT * FROM user_info WHERE username = ?";
  connection.query(sql, [username], async (err, result) => {
    if (err) {
      console.error("Error logging in: " + err.message);
      return res.status(500).send("Error logging in");
    }

    if (result.length === 0) {
      return res.status(404).send("Invalid username or password");
    }

    const user = result[0];
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      return res.status(404).send("Invalid username or password");
    }

    console.log("User logged in successfully");
    res.render("file/home2", { username });
  });
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const checkUserSql =
    "SELECT * FROM user_info WHERE username = ? OR email = ?";
  connection.query(checkUserSql, [username, email], async (err, result) => {
    if (err) {
      console.error("Error checking user: " + err.message);
      return res.status(500).send("Error checking user");
    }

    if (result.length > 0) {
      return res.status(400).send("Username or email already exists");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO user_info (username, email, password) VALUES (?, ?, ?)";
    connection.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error inserting user: " + err.message);
        return res.status(500).send("Error registering user");
      }
      console.log("User registered successfully");
      res.redirect("/login"); 
    });
  });
});



app.get("/sos", (req, res) => {
  res.render("./file/sos"); // Render sos.ejs
});


app.get("/weather", (req, res) => {
  res.render("./file/weather"); 
});
app.get("/test", (req, res) => {
  res.render("./file/index1"); 
});
app.get("/donation", (req, res) => {
  res.render("./file/donation"); 
});
