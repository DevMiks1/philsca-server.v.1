const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()
const cookieParser = require('cookie-parser');
const app = express()
const port = 8600 || 5001

const userAccount = require("./routes/userAccount");
const adminDetails = require("./routes/adminDetails");
const studentDetails = require("./routes/studentDetails");
const staffDetails = require("./routes/staffDetails");
const facultyDetails = require("./routes/facultyDetails");
const login = require("./routes/login");
const logout = require("./routes/logout");
const auth = require("./routes/auth");

const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  credentials: true, // Allow cookies and credentials
};

// MIDDLEWARE
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors(corsOptions))
app.use(cookieParser());

// FOR DATABASE 
const database = require("./config/db")
database();



app.use("/philsca", userAccount);
app.use("/philsca", adminDetails);
app.use("/philsca", studentDetails);
app.use("/philsca", staffDetails);
app.use("/philsca", facultyDetails);
app.use("/philsca", login);
app.use("/philsca", logout);

app.use("/philsca", auth);


app.listen(port, () => {
  console.log(`You are connecting to port ${port}`);
})
