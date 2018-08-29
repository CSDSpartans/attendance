const express = require('express')
const browserSync = require('browser-sync')
const app = express()
const jade = require('jade')
const SerialPort = require('serialport')
const fs = require('fs')

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
  'Brandon Ellingto',
  'Gunnar Olsen',
  'Ethan Baker',
  'Matty Burrows',
  'Soren Wilson',
  'Peter Ridgway'
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

// timeSite takes three params:
// 1. End time in the form of [hour,minute,second]
// 2. Attendance data taken by the arduino
// 3. Preset class list which allows absentees to be marked

// Broser sync to serve the site
browserSync({server: true, files: "./index.html"}, function(err, bs) {
  console.log(bs.options.getIn(["urls", "local"]))
})

function timeSite(endTime, attendanceRecord, totalStudents) {

  // See if class has ended
  let today = new Date()
  let end = new Date()
  end.setHours(endTime[0])
  end.setMinutes(endTime[1])
  end.setSeconds(endTime[2])
  if (end - today < 0){

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
    console.log(comp())
		
    fs.writeFile("./index.html", "", function(err) {if(err) { return console.log(err)}})
		fs.writeFile("./index.html", comp(), function(err) {if(err) {return console.log(err)}})

    browserSync.reload("./index.html")
  }
}

// Check to see if class has ended every 10 seconds
// End time should be [15,15,00] for 3:15 end time
setInterval(function(){timeSite([15,10,00],studentData,techIVClassroom)},10000)
