/* global $, io */
var socket = io();
var stockData = [];
var colors = ['#5DA5DA', '#FAA43A', '#60BD68', '#F17CB0', '#B2912F', '#B276B2', '#DECF3F', '#4D4D4D'];

$(document).ready(function() {
  $.get('/stocks/all', function(result) {
    result.forEach(function(company) {
      var fullName = company.company;
      var nameArray = fullName.split(" ");
      nameArray.splice(-7,7);
      company.company = nameArray.join(" ");
      addToLocalData(company);
    });
    stockData.forEach(function(company) {
      $('.flex-container').append($('<div class="flex-item company ' + company.colorCode + '">').attr('id', company.name).html('<h2>' + company.name + '</h2><span class="company-name">' + company.company + '</span>'));
      $('#' + company.name).append('<a href="#" class="remove"><i class="glyphicon glyphicon-trash"></i></a>');
    });
    drawChart(stockData); 
  });
});

$('body').on('click', '.remove', function(e) {
  var target = $(e.target).parent().parent();
  var symbol = target.attr('id');
  target.remove();
  socket.emit('remove stock', symbol);
});
  
$('form').submit(function(){
  $('#errors').text('');
  var symbol = $('#symbol').val().toUpperCase();
  var elementPos = stockData.map(function(x) { return x.name; }).indexOf(symbol);
  if (elementPos !== -1) {
    $('#errors').append('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + symbol + ' is already displayed. Try adding a different stock, or removing this one first.</div>');
    return false;
  } else if (elementPos === -1) {
    socket.emit('lookup stock', symbol);
    return false;
  }
});

socket.on('add stock', function(dataset){
  if (dataset.quandl_error) {
    $('#errors').append('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>The symbol entered is either not a valid stock symbol, or is not included in our data source. Try another stock symbol.</div>');
  } else {
    var company = dataset.dataset;
    company.company = company.name;
    company.symbol = company.dataset_code;
    addToLocalData(company);
    company = stockData[stockData.length - 1];
    $('.flex-container').append($('<div class="flex-item company ' + company.colorCode + '">').attr('id', company.name).html('<h2>' + company.name + '</h2><span class="company-name">' + company.company + '</span>'));
    $('#' + company.name).append('<a href="#" class="remove"><i class="glyphicon glyphicon-trash"></i></a>');
    drawChart(stockData);
  }
});

socket.on('remove stock', function(symbol) {
  /* Remove from chart */
  var elementPos = stockData.map(function(x) { return x.name; }).indexOf(symbol);
  stockData.splice(elementPos, 1);
  stockData.forEach(function(stock) {
    refreshColors(stock);
  });
  drawChart(stockData);
  /* Remove from directory */
  $('#' + symbol).remove();
});

var addToLocalData = function(company) {
  var inserter = {};
  inserter.name = company.symbol;
  inserter.company = convertedName(company.company);
  inserter.data = convertedData(company.data);
  inserter.tooltip = {
    valueDecimals: 2
  };
  inserter.color = colors[(stockData.length % 8)];
  inserter.colorCode = "color" + (stockData.length % 8);
  stockData.push(inserter);
};

var convertedName = function(name) {
  var nameArray = name.split(" ");
  if (nameArray.indexOf('Prices,') !== -1) {
    nameArray.splice(-7,7);
  }
  return nameArray.join(" ");
};

var convertedData = function(data) {
  data.forEach(function(datum, idx) {
    datum[0] = new Date(datum[0]).getTime();
  });
  return data;
};

var refreshColors = function(stock) {
  var num = stockData.indexOf(stock);
  var position = num % 8;
  stock.color = colors[position];
  stock.colorCode = "color" + position;
  $('#' + stock.name).attr('class', 'flex-item company ' + stock.colorCode);
};

var drawChart = function (stockData) { 
  $('#chart').highcharts('StockChart', {
    series: stockData
  });
};