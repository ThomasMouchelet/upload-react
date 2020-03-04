const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

const app = express();

// initialisation socket io
const server = http.createServer(app);
const io = socketIO(server);
server.listen(4001, () => console.log(`Listening on port ${4001}`))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.post('/upload', (req, res, next) => {
  let imageFile = req.files.file;
  imageFile.mv(`${__dirname}/public/uploads/${req.body.lastname}-${req.body.firstname}.${req.body.extend}`, function(err) {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: `public/uploads/${req.body.lastname}-${req.body.firstname}.${req.body.extend}`});

    const testFolder = './public/uploads/';
    const fs = require('fs');
    var  array = [];

    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        array.push(file);
      })
      array.splice(0,1);
      io.emit(`reloadFilesList`, array);
    })
  });
})

app.post('/files', (req, res, next) => {
  const testFolder = './public/uploads/';
  const fs = require('fs');
  var  array = [];

  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      array.push(file);
    })
    array.splice(0,1);
    res.json({files: array});
  })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});




app.listen(8000, () => {
  console.log('8000');
});

module.exports = app;