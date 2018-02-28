import serial
from time import sleep as sl

arduino = serial.Serial('/dev/cu.usbmodem1411', 115200)

while True:
    messageString = arduino.readline()[49:-2].decode("utf-8").replace('.','')
    print(messageString)
    names = ['ABHI','Hello there']
    if messageString in names:
        print("FOUND")
    else:
        print("NOT FOUND")
