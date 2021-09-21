var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/test_baza';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
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
var Car = mongoose.model('Car', CarSchema);

// module.exports = CarSchema;
module.exports = Car;