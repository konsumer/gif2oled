# tested on circuitpyhton on a pizero

import board
import digitalio
import busio
import adafruit_ssd1306
import PIL.Image as Image
from image_siouxsie import image_siouxsie_size,image_siouxsie

WIDTH = 128
HEIGHT = 64

i2c = busio.I2C(board.SCL, board.SDA)
oled = adafruit_ssd1306.SSD1306_I2C(WIDTH, HEIGHT, i2c, addr=0x3C)

oled.fill(0)

# on a pi, you can do stuff with original image & PIL directly here
# but we already have a gif all broken up into frames, and this is meawnt to demo gif2oled
# from PIL import Image, ImageDraw
# image = Image.new("1", (oled.width, oled.height))
# draw = ImageDraw.Draw(image)
# ...do draw stuff
# oled.image(image)

# load frames as PIL images
frames = []
i = 0
for frame in image_siouxsie:
  frames.append(Image.frombytes("1", (WIDTH, HEIGHT), bytes(image_siouxsie[i])))
  i = i + 1

# display loop
while True:
  oled.image(frames[i % image_siouxsie_size])
  oled.show()
  i = i + 1