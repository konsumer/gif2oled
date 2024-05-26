#include "image_siouxsie.h"

#include <bcm2835.h>
#include <cstdio>
#include "SSD1306_OLED.hpp"

#define myOLEDwidth 128
#define myOLEDheight 64
#define FULLSCREEN (myOLEDwidth * (myOLEDheight / 8))
uint8_t screenBuffer[FULLSCREEN];
SSD1306 myOLED(myOLEDwidth, myOLEDheight);

bool SetupTest() {
  const uint16_t I2C_Speed = BCM2835_I2C_CLOCK_DIVIDER_626;  //  bcm2835I2CClockDivider enum , see readme.
  const uint8_t I2C_Address = 0x3C;
  bool I2C_debug = false;
  printf("OLED Test Begin\r\n");

  // Check if Bcm28235 lib installed and print version.
  if (!bcm2835_init()) {
    printf("Error 1201: init bcm2835 library , Is it installed ?\r\n");
    return false;
  }

  // Turn on I2C bus (optionally it may already be on)
  if (!myOLED.OLED_I2C_ON()) {
    printf("Error 1202: bcm2835_i2c_begin :Cannot start I2C, Running as root?\n");
    bcm2835_close();  // Close the library
    return false;
  }

  printf("SSD1306 library Version Number :: %u\r\n", myOLED.getLibVerNum());
  printf("bcm2835 library Version Number :: %u\r\n", bcm2835_version());
  bcm2835_delay(500);
  myOLED.OLEDbegin(I2C_Speed, I2C_Address, I2C_debug);  // initialize the OLED
  myOLED.OLEDFillScreen(0xF0, 0);                       // splash screen bars, optional just for effect
  bcm2835_delay(1000);
  return true;
}

int main() {
  if (SetupTest() != true)
    return -1;

  if (!myOLED.OLEDSetBufferPtr(myOLEDwidth, myOLEDheight, screenBuffer, sizeof(screenBuffer)))
    return -1;

  myOLED.OLEDFillScreen(0x00, 0);
  myOLED.OLEDclearBuffer();

  int frame = 0;

  while (true) {
    myOLED.OLEDBitmap(0, 0, 128, 64, image_siouxsie[frame++ % image_siouxsie_size], false);
    myOLED.OLEDupdate();
    bcm2835_delay(100);
  }

  myOLED.OLEDPowerDown();  // Switch off display
  myOLED.OLED_I2C_OFF();   // Switch off I2C , optional may effect other programs & devices
  bcm2835_close();         // Close the bcm2835 library
  printf("OLED Test End\r\n");

  return 0;
}
