const express = require('express')
const app = express()
const jade = require('jade')
const SerialPort = require('serialport')

// Get the current time
let currentTime = new Date()
console.log("Current time:",currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds())

// Base html page
let jade_lines = [
  "doctype html",
  "html",
  "    body",
  "        table(border='1' width='100%' style='border:2px solid black;text-align:center;font-size:2em;font-family:Lucida Grande')",
  "            tr",
  "                th Student",
  "                th Attendance"
]

// Generate function for the jade lines of html
let generate = function(obj){
  for (i=0; i<Object.keys(obj).length; i++){
    student = Object.keys(obj)[i]
    attendance = obj[Object.keys(obj)[i]]
    jade_lines.push("            tr")
    jade_lines.push("                td "+student)
    jade_lines.push("                td "+attendance)
  }
}

let studentData = {}

// Read the RFID card
const Readline = SerialPort.parsers.Readline
const sPort = new SerialPort('/dev/cu.usbmodem1411',{baudRate: 9600})
const parser = new Readline()
sPort.pipe(parser)
parser.on('data', function(data) {
  let rawData = data.toString('utf-8')

  // Get the student name from the decoded string
  let studentCard = rawData.slice(-17,-1).split(".")[0]
  console.log(studentCard)

  // Add the student to the database based on their
  // attendance TODO (based on time)
  studentData[studentCard] = "present"
  generate(studentData)

  // Compile the jade lines to send to the site
  let comp = jade.compile(jade_lines.join("\n"), {pretty:true})

  // Use express to serve the site
  app.get('/', (req, res) => res.send(comp()))



  // TODO FIX THIS!!! When I go to update, express can't
  // because the server is already in use. See how to close
  // then reopen
  server = app.listen(3000, () => console.log('Served on port 3000'))


})

