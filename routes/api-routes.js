
var express = require('express');
var router = express.Router();
var Car = require('../db/shema');

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
    if (err !== null) {
      return next(error);
    } else if (result === null) {
      car_instance.save(function (err) {
        if (err) {
          return next(error);
        } else {
          res.status(200).json({
            msg: 'success'
          })
        }
      });
    } else {
      res.status(200).json({  // možda nesto u stilu "res.status(302).json pa to hendlaangular errorHandler?"
        msg: 'exist'
      })
    }
  });
});

router.get('/filter', function (req, res) {
  let searchTerm = {};

  // ova kobasica vjerojatno može elegantnije
  let make = req.query.make;
  let model = req.query.model;
  let year = req.query.year;

  if ((make !== undefined) && (make.length > 0)) {
    searchTerm.make = make;
  }
  if ((model !== undefined) && (model.length > 0)) {
    searchTerm.model = model;
  }
  if ((year !== undefined) && (year.length > 0) && (year !== null)) {
    searchTerm.year = year;
  }

  Car.find(searchTerm, function (err, data) {  // fuzzySearch  find
    if (err) {
      return next(err);
    } else {
      res.json(data);
    }
  });
})

router.get('/fuzzy-filter/:term', function (req, res) {
  const searchTerm = req.params.term;
  Car.fuzzySearch(searchTerm, function (err, data) {  // fuzzySearch  find
    if (err) {
      console.error('error: ', err);
      return next(err);
    } else {
      // console.log('data: ', data);
      res.json(data);
    }
  });
})

router.delete('/delete-car/:id', function (req, res) {    // delete umjesto get
  const id = req.params.id;
  Car.findByIdAndRemove(id, (error, data) => {
    if (error) {
      return next(error);
    } else {
      res.status(200).json({
        msg: data
      })
    }
  })
});

module.exports = router;