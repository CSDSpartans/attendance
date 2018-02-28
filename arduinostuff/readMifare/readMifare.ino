#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

int bluePin = 11;
int greenPin = 12;
int redPin = 13;

// If using the shield with I2C, define just the pins connected
// to the IRQ and reset lines.  Use the values below (2, 3) for the shield!
#define PN532_IRQ   (2)
#define PN532_RESET (3)  // Not connected by default on the NFC Shield

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

void setup(void) {
  Serial.begin(115200);

  nfc.begin();

  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("PN532 board not found");
    while (1); // halt
  }
  // Got ok data, print it out!
  // Serial.print("Found chip PN532");
  // Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  // Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  // configure board to read RFID tags
  nfc.SAMConfig();
  
  // Serial.println("Waiting for an ISO14443A Card ...");

  pinMode(bluePin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(redPin, OUTPUT);
}


void loop(void) {

  // Turn on blue indicator light
  digitalWrite(bluePin, HIGH);
  
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
    
  // Wait for an ISO14443A type cards. When one is found
  // 'uid' will be populated with the UID
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  
  if (success) {
    
    if (uidLength == 4)
    {
      uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
	  
      success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya);
	  
      if (success)
      {
        uint8_t data[16];

        // Try to read the contents of block 4
        success = nfc.mifareclassic_ReadDataBlock(4, data);
		
        if (success)
        {
          // Data seems to have been read ... spit it out
          nfc.PrintHexChar(data, 16);
         
          digitalWrite(bluePin, LOW);
          
          // Green for correct Red for incorrect in the future
          digitalWrite(greenPin, HIGH);
          // digitalWrite(redPin, HIGH);
          delay(500);
        }
        else
        {
          // Serial.println("Ooops ... unable to read the requested block. Slow down");
        }
      }
      else
      {
        // Serial.println("Ooops ... authentication failed: Slow down");
      }
      // ALL OFF
      digitalWrite(redPin, LOW);
      digitalWrite(greenPin, LOW);
      digitalWrite(bluePin, LOW);
    }
  }
}

