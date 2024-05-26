#define SSD1306_NO_SPLASH

#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <Wire.h>

#include "image_siouxsie.h"

// OLED display width, in pixels
#define SCREEN_WIDTH 128

// OLED display height, in pixels
#define SCREEN_HEIGHT 64

// See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32
#define SCREEN_ADDRESS 0x3D

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

int frame = 0;

void setup() {
  Serial.begin(9600);
  if (!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;)
      ;  // Don't proceed, loop forever
  }
}

void loop() {
  display.clearDisplay();
  display.drawBitmap(0, 0, image_siouxsie[frame++ % image_siouxsie_size], SCREEN_WIDTH, SCREEN_HEIGHT, SSD1306_WHITE);
  display.display();
  delay(100);
}
