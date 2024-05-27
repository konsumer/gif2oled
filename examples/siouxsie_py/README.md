This will create a little program that will show an animated splash-screen on a 128x64 OLED in python.

A system similar to this should work on any python lib for the OLED (micropython, circuitpython, etc.) I ran it on a pizero, using circuitpython.


```
# setup
sudo apt install python3-pip
sudo pip install adafruit-circuitpython-ssd1306 --break-system-packages
sudo pip install --upgrade adafruit-python-shell --break-system-packages
sudo apt install python3-pil

# run it
python main.py
```
