const browserSync = require('browser-sync')
const jade = require('jade')
const SerialPort = require('serialport')
const fs = require('fs')
const soundPlayer = require('play-sound')(opts = {})

// Generic base html setup
const jade_lines = [
  "doctype html",
  "html",
  "    body",
  "        table(border='1' width='100%' style='border:2px solid black;text-align:center;font-size:2em;font-family:Lucida Grande')",
  "            tr",
  "                th Student",
  "                th Attendance"
]

// Generate function for the jade lines of html
const generate = obj => {
  let newTable = jade_lines.slice()
  for (let i=0; i<Object.keys(obj).length; i++){
    student = Object.keys(obj)[i]
    attendance = obj[Object.keys(obj)[i]]
    newTable.push("            tr")
    newTable.push("                td "+student)
    newTable.push("                td "+attendance)
  }
  return newTable
}

// Generic data
let classData = [
  'Cole Vahey',
  'John Doe',
  'Jane Doe'
]

let studentData = {}

// Read the RFID data from arduino
const Readline = SerialPort.parsers.Readline
const sPort = new SerialPort('/dev/cu.usbmodem1411',{baudRate: 9600})
const parser = new Readline()
sPort.pipe(parser)
parser.on('data', data => {

  // Get the student name from the arduino buffer
  let studentCard = data.toString('utf-8').slice(-17,-1).split('.')[0]
  console.log(studentCard)

  // SOUND STUFF
  if (studentCard === 'Cole Vahey'){
    soundPlayer.play('sounds/smb.mp3', err => {if (err) throw err})
  } else {
    soundPlayer.play('sounds/Blip.mp3', err => {if (err) throw err})
  }

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
    // Added to update whenever new data is received
    sync(studentData, classData)
  }
})

fs.writeFile("./index.html", '', err => {if(err) throw err})
// Broser sync to serve the site
browserSync({server: true, files: "./index.html"}, (err, bs) => {
  if (err) throw err
  console.log(bs.options.getIn(["urls", "local"]))
})

// timeSite takes two params:
// 2. Attendance data taken by the arduino
// 3. Preset class list which allows absentees to be marked
const sync = (attendanceRecord, totalStudents) => {

  // Mark all the kids in the class who weren't there absent
  let attendanceData = JSON.parse(JSON.stringify(attendanceRecord))
  for (let i=0;i<totalStudents.length;i++){
    student = totalStudents[i]
    if (!(student in attendanceRecord)){
      attendanceData[student] = "absent"
    }
  }

  // Sort based on lastnames alphabetically
  let lastNames = []
  let finalData = {}
  for (let i=0;i<totalStudents.length;i++){
    lastNames.push(totalStudents[i].split(' ')[1])
  }
  lastNames.sort()
  for (let i=0;i<lastNames.length;i++){
    for (let j=0;j<totalStudents.length;j++){
      if (totalStudents[j].split(' ')[1] == lastNames[i]){
        finalData[[lastNames[i],totalStudents[j].split(' ')[0]].join(', ')] = attendanceData[totalStudents[j]]
      }
    }
  }

  // Generate html
  let html = generate(finalData)
  let comp = jade.compile(html.join('\n'), {pretty:true})
 	
  // Write the new html to the index.html file
  fs.writeFile("./index.html", '', err => {if(err) throw err})
  fs.writeFile("./index.html", comp(), err => {if(err) throw err})

}

// Testing: Update the attendance record every 20 seconds
// setInterval(function(){sync(studentData,classData)},20000)