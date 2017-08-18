#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

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
  Serial.print("Found chip PN532");
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);

  // configure board to read RFID tags
  nfc.SAMConfig();
  
  Serial.println("Waiting for an ISO14443A Card to write to…");
}


void loop(void) {
  uint8_t success;
  uint8_t blankcheck;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };  // Buffer to store the returned UID
  uint8_t uidLength;                        // Length of the UID (4 or 7 bytes depending on ISO14443A card type)
    
  // Wait for an ISO14443A type cards. When one is found
  // 'uid' will be populated with the UID
  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  
  if (success) {
    // Display some basic information about the card
    Serial.println("Found an ISO14443A card");
    
    if (uidLength == 4)
    {
      // If Mifare Classic card found 
      Serial.println("Mifare Classic card found (4 byte UID)");
    
      // Now we need to try to authenticate it for read/write access
      // Try with the factory default KeyA: 0xFF 0xFF 0xFF 0xFF 0xFF 0xFF
      Serial.println("Authenticating block 4 with default KEYA value");
      uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };
    
    // Start with block 4 (the first block of sector 1) since sector 0
    // contains the manufacturer data and it's probably better just
    // to leave it alone unless you know what you're doing
      success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya);
    
      if (success)
      {
        Serial.println("Sector 1 (Blocks 4..7) has been authenticated");
        uint8_t data[16];

        //**TODO: FIGURE OUT HOW TO CHECK FOR A BLANK CARD**
        //
        //
        //
        //
        blankcheck = nfc.mifareclassic_ReadDataBlock(4, data);
        if (blankcheck != (const uint8_t[]){ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0})
        {
          Serial.println("THIS CARD ALREADY CONTAINS A UID");
          Serial.println("TO ABORT FORMATTING, REMOVE CARD FROM SHIELD");
          nfc.PrintHexChar(data, 16);
          Serial.println("");
          delay(3000);
        }
        
        //Write to the card at a 16 character length
        memcpy(data, (const uint8_t[]){ 'T', 'E', 'S', 'T', 'E', 'R', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}, sizeof data);
        success = nfc.mifareclassic_WriteDataBlock (4, data);

        if (success)
        {
         //Card formatted successfully
          Serial.println("If card remained on shield, encoded with data:");
          nfc.mifareclassic_ReadDataBlock(4, data);
          nfc.PrintHexChar(data, 16);
          Serial.println("");
      
          // Wait a bit before writing to a different card
          delay(3000);
        }
        else
        {
          Serial.println("Ooops ... unable to write to the card. Slow down or try another key");
        }
      }
      else
      {
        Serial.println("Ooops ... authentication failed: Slow down or try another key");
      }
    }
  }
}

