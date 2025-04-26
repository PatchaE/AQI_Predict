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
app.post('/getAlldata_predict', async (req, res) => {
  try {
      
      const { date } = req.body; // รับค่าจาก Body
      const result = await knex .select('*')
      .from('data_predict')
      
      res.set('Content-Type', 'application/json');
      res.json(result);  // ส่งผลลัพธ์ไปยัง client
  } catch (error) {
      console.error('Error:', error);  // แสดงข้อผิดพลาดในคอนโซลของเซิร์ฟเวอร์
      res.status(500).json({ error: error.message });
  }
});
app.post('/data', async (req, res) => {
    try {
        
        const { date } = req.body; // รับค่าจาก Body
        const result = await knex.select('*')
        .from('sensor_data')
        .whereRaw('DATE(`timestamp`) = ?', [date]);
        
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
      const result = await knex.select('*').from('data_predict')
      .where(knex.raw('DATE(timestamp) = ?', date));
      
      res.set('Content-Type', 'application/json');
      res.json(result);  // ส่งผลลัพธ์ไปยัง client
  } catch (error) {
      console.error('Error:', error);  // แสดงข้อผิดพลาดในคอนโซลของเซิร์ฟเวอร์
      res.status(500).json({ error: error.message });
  }
});
app.post('/insert_data', async (req, res) => {
  try {
      const { temp,hum,pm2_5,pm10,ozone,carbon,nitro,sulfur,people_no } = req.body; // รับค่าจาก Body
      const result = await knex('sensor_data').insert({
        temp: parseFloat(temp),
        hum: parseFloat(hum),
        pm2_5: parseFloat(pm2_5),
        pm10: parseFloat(pm10),
        ozone: parseFloat(ozone),
        carbon: parseFloat(carbon),
        nitro: parseFloat(nitro),
        sulfur: parseFloat(sulfur),
        people_no: Number(people_no),
      });
      //res.set('Content-Type', 'application/json');
      res.json('Insert Success, ID:', result[0]);  // ส่งผลลัพธ์ไปยัง client
  } catch (error) {
      console.error('Error:', error);  // แสดงข้อผิดพลาดในคอนโซลของเซิร์ฟเวอร์
      res.status(500).json({ error: error.message });
  }
});
app.post('/insert_data_predict', async (req, res) => {
  try {
    const { predict_pm25,predict_pm10,predict_no2,predict_co,predict_so2,predict_o3,predict_aqi,predict_temp,predict_hum } = req.body; // รับค่าจาก Body
    const result = await knex('data_predict').insert({
      predict_pm25: parseFloat(predict_pm25),
      predict_pm10: parseFloat(predict_pm10),
      predict_no2: parseFloat(predict_no2),
      predict_co: parseFloat(predict_co),
      predict_so2: parseFloat(predict_so2),
      predict_o3: parseFloat(predict_o3),
      predict_aqi: parseFloat(predict_aqi),
      predict_temp: parseFloat(predict_temp),
      predict_hum: parseFloat(predict_hum),
    });
    //res.set('Content-Type', 'application/json');
    res.json('Insert Success, ID:', result[0]);  // ส่งผลลัพธ์ไปยัง client
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