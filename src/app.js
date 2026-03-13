require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

const connectDB = require("./config/database");

const authRouter = require('./routes/auth');
const sessionRouter = require('./routes/sessionRoutes');
const geminiRouter = require('./routes/geminiRoutes');

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', authRouter);
app.use('/', sessionRouter);
app.use('/', geminiRouter);

const PORT = process.env.PORT || 5001;
connectDB().then(() => {
  console.log("Database connection established...");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Database cannot be connected!!");
  console.error(error);
});
