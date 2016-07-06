'use strict';
var Quandl = require('quandl');
var Dataset = require('../models/datasetSchema.js');

var stockCtrl = function(){
  var that = this; 
  
  this.retrieveStockData = function(symbol) {
    return new Promise(function(resolve, reject) {
      var clientKey = process.env.QUANDL_KEY; 
      var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + symbol + '/data.json?api_key=' + clientKey;
      
      var quandl = new Quandl({
        auth_token: process.env.QUANDL_KEY,
        api_version: 3
      });
      
      quandl.dataset({
        source: "WIKI",
        table: symbol.toUpperCase(),
      },{
        order: 'asc',
        exclude_column_names: true,
        start_date: '2015-07-01',
        end_date: '2016-06-30',
        column_index: 4
      },function(err, response) {
        if (err) { 
          console.log(err);
          reject(Error(err)); 
        }
        var parsed = JSON.parse(response);
        that.transformAndSave(parsed);
        resolve(parsed);  
      });
    });
  };
  
  this.transformAndSave = function(quandlData) {
    return new Promise(function(resolve, reject) {
      
      var company = quandlData.dataset.name;
      var symbol = quandlData.dataset.dataset_code;
      var data = quandlData.dataset.data;
      
      Dataset.findOne({symbol: symbol}).remove(function(err, results) {
        if (err) { throw err };
        console.log(results);
        var doc = {company: company, symbol: symbol, data: data};
        var newSet = new Dataset(doc);
        newSet.save(function(result) {
          resolve(result);
        });
      });
    });
  };
  
  this.removeStock = function(symbol) {
    Dataset.findOneAndRemove({ symbol: symbol }, function(err, result) {
      if (err) { throw err; }
      console.log("Removed stock: " + JSON.stringify(result));
    });
  };

  this.loadAll = function() {
    return new Promise(function(resolve, reject) {
      Dataset.find().exec(function (err, result) {
        if (err) {
          reject(Error(err))
        } else if (result) {
          resolve(result);
        }
      });
    });
  };
};

module.exports = stockCtrl;