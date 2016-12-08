#!/usr/bin/env node
 
var c = require('skilstak-colors')

var barcode = "001932"
var students = {
  "001932":"Cole Vahey",
  "001933":"Collin Flannery",
  "001934":"Logan Godfrey",
  "001935":"Konrad Christian",
  "001936":"William Muhlbach"
}

var assign = function(code,json) {
  if (barcode in students){
    console.log(c.clear + "\n" + c.green + json[code] + "\n")
  } else {
    console.log(c.clear + c.red + "That code is invalid\n")
  }
}

/*These parameters will be inputed through a json file and the scanned
 * barcode*/
assign(barcode,students)
