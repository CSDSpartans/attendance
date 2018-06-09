const express = require('express')
const app = express()
const jade = require("jade")

let studentData = {
  "present":["Cole Vahey","Gunnar Olsen"],
  "late":["Jack Martin"],
  "absent":["Soren Wilson"]
}

let jade_string = [
  "doctype html",
  "html",
  "    body",
  "        table(border='1' width='100%' style='text-align:center;font-size:2em;font-family:Lucida Grande')",
  "            tr",
  "                th(style='background-color:#9fff99') Present",
  "                th(style='background-color:#fff899') Late",
  "                th(style='background-color:#ff9999') Absent",
  "            tr",
  "                td Cole Vahey",
  "                td Jack Martin",
  "                td",
  "            tr",
  "                td Soren Wilson",
  "                td",
  "                td Jack Martin"
].join("\n")

let fn = jade.compile(jade_string, {pretty:true})
console.log(fn())

app.get('/', (req, res) => res.send(fn()))

let port = 3000
app.listen(port, () => console.log('Served on port', port))
