const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
  list_id: { type: mongoose.Schema.Types.ObjectId, ref: 'List', required: true },
  data: { type: [mongoose.Schema.Types.Mixed], required: true }  // Store data as an array of objects
});

// Check if the model already exists
const ListItem = mongoose.models.ListItem || mongoose.model('ListItem', listItemSchema);

module.exports = ListItem;
