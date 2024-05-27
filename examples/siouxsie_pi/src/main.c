#include "image_siouxsie.h"
#include "oled.h"

int main(int argc, char* argv[]) {
  int fd = i2c_open(1);

  if (fd < 0) {
    perror("Could not open i2c bus.");
    return 1;
  }

  if (i2c_set_addr(fd, SSD1306_OLED_ADDR) < 0) {
    perror("Could not open the oled.");
    return 1;
  }

  oled_setup(fd);

  int i = 0;
  while (true) {
    clearDisplay(fd);
    drawBitmap(0, 0, image_siouxsie[i % image_siouxsie_size], 128, 64, WHITE);
    Display(fd);
    usleep(100000);
    i++;
  }

  return 0;
}