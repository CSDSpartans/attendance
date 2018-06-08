const express = require('express')
const app = express()
const jade = require("jade")

let jade_string = [
  "doctype html",
  "html",
  "    body",
  "        table(id='studenttable', border='1')",
  "            tr",
  "                td COLE",
  "                td JAJA"
].join("\n")

let fn = jade.compile(jade_string, {pretty:true})
console.log(fn())

app.get('/', (req, res) => res.send(fn()))

let port = 3000
app.listen(port, () => console.log('Served on port', port))
