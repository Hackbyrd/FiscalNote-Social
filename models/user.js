var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  startdate: Date,
  birthday: Date,
  email: { type: String, index: { unique: true } }, // must be @fiscalnote.com
  password: String,
  phone: String,
  role: { type: String, enum: ['Admin', 'User'] },
  education: String,
  sex: { type: String, enum: ['Male', 'Female'] },
  age: { type: Number, min: 0, max: 150 },
  religion: String,
  ethnicity: String,
  nationality: String,
  position: String,
  hometown: String,
  fngroupid: { type: Number, min: 1 },
  relationship: { type: String, enum: ['Married', 'Single', 'In a Relationship', 'It\'s Complicated', null] },
  department: { type: String, enum: ['Engineering', 'Policy', 'Founder', 'Business', 'Operations', 'Marketing', 'Customer Success', 'Product'] },
  index: { type: Number, min: 0, unique: true }, // index in matrix,
  status: { type: String, enum: ['Full-Time', 'Part-Time', 'Intern', 'Inactive', 'Fired'] },
  office: { type: String, enum: ['Washington, D.C.', 'New York City', 'Seoul, Korea', 'Remote'] },
  twitter: String,
  linkedin: String,
  facebook: String,
  extention: String,
  matches: String, // '0 1 2 3 4 2 1 1'
});

module.exports = mongoose.model('User', userSchema);
