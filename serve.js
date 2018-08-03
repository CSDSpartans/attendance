const express = require('express')
const app = express()
const jade = require('jade')
const SerialPort = require('serialport')

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

  // Get the student name from the buffer string
  let studentCard = data.toString('utf-8').slice(-17,-1).split(".")[0]
  console.log(studentCard)

  // Set up today's time and class start
  classTime = [19,01,20]
  let today = new Date()
  let classStart = new Date()
  classStart.setHours(classTime[0])
  classStart.setMinutes(classTime[1])
  classStart.setSeconds(classTime[2])

  // Add their attendance to the studentData
  if (!(studentCard in studentData)) {
    if (today - classStart < 0){
      studentData[studentCard] = "present"
    } else {
      studentData[studentCard] = "late"
    }
  }
  console.log(studentData)
})

function serveSite(endTime, attendanceRecord, totalStudents) {

  // Get the current time
  let today = new Date()
  let end = new Date()
  end.setHours(endTime[0])
  end.setMinutes(endTime[1])
  end.setSeconds(endTime[2])

  // See if class has ended
  if (end - today < 0){
    // Compile the jade lines to send to the site
    // Have to do something extra with attendanceRecord and
    // totalStudents
    generate(studentData)
    let comp = jade.compile(jade_lines.join("\n"), {pretty:true})

    // Use express to serve the site
    app.get('/', (req, res) => res.send(comp()))
    let port = 3000
    app.listen(port, () => console.log('Served on port',port))
  }
}

// FILL IN X, Y, AND Z
// serveSite([18,40,00],"y","z")
