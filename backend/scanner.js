#!/usr/bin/env node
 
var students = {
  "9":{"Civics":["Logan Godfrey","John Doe","Ethan Adler"]},
  "10":{"World History":["Cole Vahey","Collin Flannery","William Muhlbach"]},
  "11":{"Science":["Konrad Christian","Christopher Dauber"]},
  "12":{"Math":["Joe Keller","GRADUATING SENIOR"]}
}

var findStudent = function(student,grades){
  for (grade in grades){
    for (classroom in grades[grade]){
      for (num in grades[grade][classroom]){
        if (student == grades[grade][classroom][num]){
          console.log(student + " is in " + grade + "th grade " + classroom)
          return
        }
      }
    }
  }
  /*If the program is not exited*/
  console.log("ERROR: STUDENT NOT FOUND")
}

/*These parameters will be inputed through a json file and the scanned
* barcode*/
findStudent("Cole Vahey",students)
