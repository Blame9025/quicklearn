const express = require("express");
const cors = require("cors");

require('dotenv').config();
const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));


app.use(express.json());
const mongoURL = process.env.DATABASE_URL;

app.use(express.urlencoded({ extended: true }));
const db = require("./db.js");
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  db.mongoose.connect(mongoURL)
  .then(() => {
      console.log('[API DB] Connected to MongoDB');
  })
  .catch((error) => {
      console.error('[API DB] ', error);
  });
  
  console.log(`Server is running on port ${PORT}.`);
});