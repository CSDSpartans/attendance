/*#!/usr/bin/env node*/
 
var alerter = function () {
  console.log("BARCODE: " + document.getElementById("enterbar").value)
  document.getElementById("enterbar").select()
}

var students = {
  "9":
    {
      "Civics":
        {
          "Logan Godfrey":"present",
          "John Doe":"present",
          "Ethan Adler":"absent",
          "Demetrice Towers":"present",
          "Bart Champine":"absent"
        },
      "Math":
        {
          "Elda Cruz":"present",
          "Danae Shiley":"absent",
          "Rhea Keating":"present",
          "Stanley Bloch":"present",
          "Reena Parkman":"present"
        }
    },
  "10":
    {
      "World History":
        {
          "Cole Vahey":"present",
          "Collin Flannery":"present",
          "William Muhlbach":"present",
          "Eda Fant":"absent",
          "Milan Lefever":"present"
        },
      "English":
        {
          "Violette Schillaci":"present",
          "Verona Winders":"present",
          "Cherly Oppenheimer":"present",
          "Sheila Gammon":"absent",
          "Isabella Hulings":"present"
        }
    },
  "11":
    {
      "Science":
        {
          "Konrad Christian":"absent",
          "Christopher Dauber":"present",
          "Joane Browne":"present",
          "Rudolf Bothwell":"present",
          "Dallas Mayhue":"present"
        },
      "APES":
        {
          "Kanesha Saulsberry":"present",
          "Nita Daw":"present",
          "Clint Marker":"present",
          "Cleveland Hires":"present",
          "Lucien Ottman":"present"
        }
    },
  "12":
    {
      "Math":
        {
          "Joe Keller":"present",
          "GRADUATING SENIOR":"absent",
          "Ossie Fedele":"present",
          "Lashonda Rominger":"present",
          "Rosaria Bianchi":"absent"
        },
      "APUSH":
        {
          "Hank Mumford":"present",
          "Kory Bohlen":"absent",
          "Frieda Calhoon":"present",
          "Maryellen Bear":"present",
          "Lorelei Bertolini":"absent"
        }
    }
}

var findStudent = function(student,grades){
  for (grade in grades){
    for (classroom in grades[grade]){
      if (student in grades[grade][classroom]){
        console.log(student + " is in " + grade + "th grade " + classroom + " and they are " + grades[grade][classroom][student])
        return
      }
    }
  }
  /*If the program is not exited*/
  console.log("ERROR: STUDENT NOT FOUND")
}

/*These parameters will be inputed through a json file and the scanned
* barcode*/
/*findStudent("Elda Cruz",students)
findStudent("Collin Flannery",students)*/
