var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors')

const knex = require("./database/db");

var app = express();
app.use(cors())

// view engine setup
//app.set('view engine', 'ejs');
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.post('/data', async (req, res) => {
    try {
        const { date } = req.body; // รับค่าจาก Body
        const result = await knex.select('*').from('sensor_data')
        .where(knex.raw('DATE(timestamp) = ?', date));
        
        res.set('Content-Type', 'application/json');
        res.json(result);  // ส่งผลลัพธ์ไปยัง client
    } catch (error) {
        console.error('Error:', error);  // แสดงข้อผิดพลาดในคอนโซลของเซิร์ฟเวอร์
        res.status(500).json({ error: error.message });
    }
});
app.post('/data_predict', async (req, res) => {
  try {
      const { date } = req.body; // รับค่าจาก Body
      const result = await knex.select('*').from('sensor_data_predict')
      .where(knex.raw('DATE(timestamp) = ?', date));
      
      res.set('Content-Type', 'application/json');
      res.json(result);  // ส่งผลลัพธ์ไปยัง client
  } catch (error) {
      console.error('Error:', error);  // แสดงข้อผิดพลาดในคอนโซลของเซิร์ฟเวอร์
      res.status(500).json({ error: error.message });
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;