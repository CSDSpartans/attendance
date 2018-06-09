const express = require('express')
const app = express()
const jade = require("jade")

let studentData = {
  "present":["Adam Nordik","Jacob Smith"],
  "late":["James Michael","Matthew Greene","Brian Rett"],
  "absent":["Dennis Smith", "Sam Darnold"]
}

let jade_lines = [
  "doctype html",
  "html",
  "    body",
  "        table(border='1' width='100%' style='border:2px solid black;text-align:center;font-size:2em;font-family:Lucida Grande')",
  "            tr",
  "                th(style='background-color:#9fff99') Present",
  "                th(style='background-color:#fff899') Late",
  "                th(style='background-color:#ff9999') Absent"
]

let generate = function(obj){
  for (i = 0; i < Math.max(obj.present.length,obj.late.length,obj.absent.length); i++) {
    p = ""
    l = ""
    a = ""
    if (obj.present[i] != null) {
      p = obj.present[i]
    }
    if (obj.late[i] != null) {
      l = obj.late[i]
    }
    if (obj.absent[i] != null) {
      a = obj.absent[i]
    }
    jade_lines.push("            tr")
    jade_lines.push("                td "+p)
    jade_lines.push("                td "+l)
    jade_lines.push("                td "+a)
  }
}

generate(studentData)

let comp = jade.compile(jade_lines.join("\n"), {pretty:true})
console.log(comp())

app.get('/', (req, res) => res.send(comp()))

let port = 3000
app.listen(port, () => console.log('Served on port', port))
