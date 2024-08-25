const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true }
});

const listSchema = new mongoose.Schema({
  title: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  access_key: { type: String, required: true, unique: true },
  heading: { type: String, required: true },
  about: { type: String, required: true },
  columns: { type: [columnSchema], required: true },  // Define columns as an array of objects
  queryColumn: { type: String, required: true }  // Field to indicate the column to be used for querying
}, { timestamps: true });

module.exports = mongoose.model('List', listSchema);
