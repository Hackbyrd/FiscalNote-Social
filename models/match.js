var mongoose = require('mongoose');

// ObjectId("507c7f79bcf86cd7994f6c0e").getTimestamp() to get date created
var matchSchema = mongoose.Schema({
  date:             Date, // the current day this was created
  current:          String, // this weeks matches, represented in a matrix string
  overall:          String, // Total matches over time, represented in a matrix string
  totalEmployees:   { type: Number, min: 0 }
});

module.exports = mongoose.model('Match', matchSchema);
