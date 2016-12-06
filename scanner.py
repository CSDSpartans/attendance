#!/usr/bin/env python3
 
import skilstak.colors as c
import json

with open("students.json","r") as students:
    numberkey = json.load(students)
    for x,y in numberkey.items():
        print(x + " is to --> " + str(y))

studentfind = input("Please enter a student's name\n>> ").title()
print(studentfind)
