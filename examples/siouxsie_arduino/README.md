This will create a little program that will show an animated splash-screen on a 128x64 OLED, on a pi, in C. It uses [Adafruit_SSD1306](https://github.com/adafruit/Adafruit_SSD1306).

Install the Adafruit_SSD1306 lib with the Arduino IDE Library Manager, and open the ino file. It should work on any of [these](https://github.com/adafruit/Adafruit_SSD1306?tab=readme-ov-file#compatibility), and even others with a little modification, as the generated C headers are extremely standard for embedding bitmaps in code.

This was tested on an Arduino UNO. Here is how I hooked it up:

![wiring diagram](https://docs.arduino.cc/static/5f90596512320d9577cfa9638fdb6115/29114/wiring.png)

