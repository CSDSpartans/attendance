const express = require('express')
const app = express()
const jade = require('jade')
const SerialPort = require('serialport')

// Generic base html setup
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

// Generic FULL CLASS data
let techIVClassroom = [
  'Cole Vahey',
  'William Muhlbach',
  'Jack Martin',
  'Brandon Ellington',
  'Gunnar Olsen',
  'Ethan Baker',
  'Luke Whiteside'
]

let studentData = {}

// Read the RFID data from arduino
const Readline = SerialPort.parsers.Readline
const sPort = new SerialPort('/dev/cu.usbmodem1411',{baudRate: 9600})
const parser = new Readline()
sPort.pipe(parser)
parser.on('data', function(data) {

  // Get the student name from the arduino buffer
  let studentCard = data.toString('utf-8').slice(-17,-1).split('.')[0]
  console.log(studentCard)

  // Set up current time and class start time 
  // (plus one minute grace period)
  classTime = [13,42,00]
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
  // Debug
  // console.log(studentData)
})

let serving = false

// timeSite takes three params:
// 1. End time in the form of [hour,minute,second]
// 2. Attendance data taken by the arduino
// 3. Preset class list which allows absentees to be marked
function timeSite(endTime, attendanceRecord, totalStudents) {

  // See if class has ended
  let today = new Date()
  let end = new Date()
  end.setHours(endTime[0])
  end.setMinutes(endTime[1])
  end.setSeconds(endTime[2])
  if (end - today < 0 && serving == false){

    // Mark all the kids in the class who weren't there absent
    let attendanceData = attendanceRecord
    for (i=0;i<totalStudents.length;i++){
      student = totalStudents[i]
      if (!(student in attendanceRecord)){
        attendanceData[student] = "absent"
      }
    }

    // Sort based on lastnames alphabetically
    let lastNames = []
    let finalData = {}
    for (i=0;i<totalStudents.length;i++){
      lastNames.push(totalStudents[i].split(' ')[1])
    }
    lastNames.sort()
    for (i=0;i<lastNames.length;i++){
      for (j=0;j<totalStudents.length;j++){
        if (totalStudents[j].split(' ')[1] == lastNames[i]){
          finalData[[lastNames[i],totalStudents[j].split(' ')[0]].join(', ')] = attendanceData[totalStudents[j]]
        }
      }
    }

    // Generate jade html
    generate(finalData)
    let comp = jade.compile(jade_lines.join('\n'), {pretty:true})

    // Use express to serve the site
    app.get('/', (req, res) => res.send(comp()))
    let port = 3000
    app.listen(port, () => console.log('Served on port',port))
    serving = true
  }
}

// Check to see if class has ended every 15 seconds
setInterval(function(){timeSite([15,15,00],studentData,techIVClassroom)},15000)
