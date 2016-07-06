'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataset = new Schema({
  company: String,
  symbol: String,
  data: Array
});

module.exports = mongoose.model('Dataset', dataset);

