#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include "image_siouxsie.h"

// OLED display width, in pixels
#define SCREEN_WIDTH 128

// OLED display height, in pixels
#define SCREEN_HEIGHT 64

// See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
#define SCREEN_ADDRESS 0x3D

// Reset pin # (or -1 if sharing Arduino reset pin)
#define OLED_RESET -1

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

int frame = 0;

void setup() {}

void loop() {
  display.clearDisplay();
  display.drawBitmap(0, 0, image_siouxsie[frame++ % image_siouxsie_size], SCREEN_WIDTH, SCREEN_HEIGHT, 1);
  display.display();
  delay(100);
}
