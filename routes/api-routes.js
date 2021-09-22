
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
// var mongoDB = 'mongodb://127.0.0.1/test_baza'; 
var url = require('./dburl');
const CA =  {
  tlsCAFile: `${__dirname}/ca-certificate.crt`,
};
mongoose.connect(url, {useNewUrlParser: true }); // , useUnifiedTopology: true
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;
var CarSchema = new Schema({
  make: String,
  model: String,
  year: Number
});

// Compile model from schema
var Car = mongoose.model('Car', CarSchema, 'vehicle-types');

router.get('/get-all-cars', function (req, res) {
  Car.find((error, data) => {
    if (error) {
      return next(error);
    } else {
      res.json(data);
    }
  })
});

router.post('/add-car', function (req, res) {
  console.log(req.body);
  var car_instance = new Car({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year
  });
  Car.findOne({
    make: req.body.make,
    model: req.body.model,
    year: req.body.year
  }, function (err, result) {
    console.log('what happended: ', err, result);
    if (err !== null) {
      console.log('ERROR1: ', err);
      return next(error);
      // return handleError(err);
    } else if (result === null) {
      car_instance.save(function (err) {
        if (err) {
          console.log('ERROR2: ', err);
          return next(error);
          // return handleError(err);
        } else {
          res.status(200).json({
            msg: 'success'
          })
        }
      });
      //res.send({'status':'ok'});

    } else {
      res.status(200).json({  // možda nesto u stilu "res.status(302).json pa to hendlaangular errorHandler?"
        msg: 'exist'
      })
    }
  });
});

router.get('/filter', function (req, res) {
  console.log('FILTER: ', req.query);
  let searchTerm = {};

  // ova kobasica vjerojatno može elegantnije
  let make = req.query.make;
  let model = req.query.model;
  let year = req.query.year;
  if (make.length > 0) {
    searchTerm.make = make;
  }
  if (model.length > 0) {
    searchTerm.model = model;
  }
  if ((year.length > 0) && (year !== null)) {
    searchTerm.year = year;
  }
  console.log('search Object: ', searchTerm);
  
  
  Car.find(searchTerm, function (err, data) {  // fuzzySearch  find
    console.log('car.find start');
    if (err) {
      console.log('err: ', err);
      return next(err);
    } else {
      console.log('data: ', data);
      res.json(data);
    }
    console.log(data);
  });
  })

router.delete('/delete-car/:id', function (req, res) {    // delete umjesto get
  console.log('req.params.id: ', req.params.id);
  Car.findByIdAndRemove(req.params.id, (error, data) => {
    if (error) {
      console.log('error: ', error);
      return next(error);
    } else {
      console.log('found: ', data);
      res.status(200).json({
        msg: data
      })
    }
  })
});


module.exports = router;