#!/usr/bin/env python3
 
import colors as c
import json
from time import sleep as s

with open("studentdata.json","r+") as studentdata:
    grades = json.load(studentdata)
    print(c.clear + c.red + "Grade levels:" + c.x)
    for x,y in grades.items():
        print(x + " --> " + str(y))

def find_class():
    grade = input("Please enter a grade level\n>> " + c.blue)
    if grade in grades:
        print(grades[grade])
        classroom = input(c.x + "Please enter a class\n>> " + c.blue).title()
        if classroom in grades[grade]:
            print(c.x + "Students:")
            for student in grades[grade][classroom]:
                print(c.x + student)
        else:
            print("That class either does not exist or is not documented." + c.x)
    else:
        print("That grade level is not documented.")

def find_student():
    student = input("What is the student's name?\n>> ").title()
    for grade in grades:
        for classroom in grades[grade]:
            if student in grades[grade][classroom]:
                print(c.x + student + " is in " + grade + "th grade " + classroom)
                exit()
    else:
        print("ERROR: STUDENT NOT FOUND")

find_class()
find_student()
