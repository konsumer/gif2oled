from machine import Pin, I2C
from ssd1306 import SSD1306_I2C
import framebuf,sys
import image_siouxsie

pix_res_x  = 128 # SSD1306 horizontal resolution
pix_res_y = 64   # SSD1306 vertical resolution

i2c_dev = I2C(1,scl=Pin(27),sda=Pin(26),freq=200000)  # start I2C on I2C1 (GPIO 26/27)
i2c_addr = [hex(ii) for ii in i2c_dev.scan()] # get I2C address in hex format
if i2c_addr==[]:
    print('No I2C Display Found') 
    sys.exit() # exit routine if no dev found
else:
    print("I2C Address      : {}".format(i2c_addr[0])) # I2C device address
    print("I2C Configuration: {}".format(i2c_dev)) # print I2C params


oled = SSD1306_I2C(pix_res_x, pix_res_y, i2c_dev) # oled controller

# build array of framebuffers
fbs = []
i = 0
for frame in image_siouxsie:
  fbs[i] = framebuf.FrameBuffer(frame, pix_res_x, pix_res_y, framebuf.MONO_HLSB)
  i = i + 1

# loop through frames and show them
frame = 0
while True:
  frame = (frame + 1) % image_siouxsie_size
  oled.fill(0)
  oled.blit(fb[frame], 0, 0)
  oled.show()