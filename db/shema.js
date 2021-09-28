
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
};
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

var mongoose = require('mongoose');
var url = 'mongodb://127.0.0.1/test_baza';  // od prije local
// var url = require('./dburl');

mongoose.connect(url, options); //    {useNewUrlParser: true }    options , useUnifiedTopology: true
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;
var CarSchema = new Schema({
  make: String,
  model: String,
  year: Number
});

CarSchema.plugin(mongoose_fuzzy_searching, { fields: ['make', 'model'] });

// Compile model from schema
var Car = mongoose.model('Car', CarSchema, 'vehicle-types');


const { each, queue } = require('async');
const updateFuzzy = async (Model, attrs) => {
  console.log('1');
   const docs = await Model.find();

   const updateToDatabase = async (data, callback) => {
      try {
         if(attrs && attrs.length) {
            const obj = attrs.reduce((acc, attr) => ({ ...acc, [attr]: data[attr] }), {});
            return Model.findByIdAndUpdate(data._id, obj).exec();
         }

         return Model.findByIdAndUpdate(data._id, data).exec();
      } catch (e) {
         console.log(e);
      } finally {
         callback();
      }
   };

   const myQueue = queue(updateToDatabase, 10);
   each(docs, (data) => myQueue.push(data.toObject()));

   myQueue.empty = function () {};
   myQueue.drain = function () {};
}

// samo jednom po fieldu za kreirati indexe
// updateFuzzy(Car, ['make, 'model']);

module.exports = Car;



