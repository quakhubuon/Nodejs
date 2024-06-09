const express = require('express');
const mongoose = require('mongoose');
const routes = require('./app/routes/index');
const bodyParser = require("body-parser");
const session = require('express-session');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const uri = 'mongodb://localhost:27017/Northwind';

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
})
.then(() => console.log("Connect DB Success!!!"))
.catch(err => console.log(err.reason));

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());  // Sử dụng cors middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Sử dụng express-session trước khi tạo MongoStore
app.use(session({
  secret: 'yourSecretKeyHere',
  resave: false,
  saveUninitialized: false,
}));

app.listen(port, () => {
  console.log('RESTful API server started on: ' + port);
});

// API tạo sản phẩm
routes(app);
// Endpoint để truy cập hình ảnh
app.get('/images/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'app', 'assets', 'images', imageName);

  // Trả về hình ảnh
  res.sendFile(imagePath);
});

// Serve the Swagger UI files
app.use('/swaggers', express.static(path.join(__dirname, 'swagger-ui', 'dist')));

// Serve the swagger.yaml file
app.use('/api-docs', express.static(path.join(__dirname, 'api-docs')));
