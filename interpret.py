import serial
from time import sleep as sl

arduino = serial.Serial('/dev/cu.usbmodem1411', 115200)

# Start
sl(2)
arduino.write(b'S')

try:
    while True:
        messageString = arduino.readline()[49:-2].decode("utf-8").replace('.','')
        names = ['ABHI','Hello there']
        if messageString in names:
            print("FOUND - ", end="")
        elif messageString == "":
            print("Card has not been written yet", end="")
        else:
            print("NOT FOUND - ", end="")
        print(messageString)
except:
    print("\nKeyboard interrupt or error???")
