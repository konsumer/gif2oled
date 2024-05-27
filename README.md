I wanted to make an efficient splash screen that can start really early in pizero boot, on an OLED screen.

This will generate the C code to do this, as well as micropython code, and arduino code, for other targets.

It can also generate code for micropython & arduino.

Once you have built your header, check out [examples](examples) to see how to use it. There are lots of ways to display images on OLED displays, and most devices have a way to do it n C or micropython, so you should be able to combine these ideas to work on any device, however you prefer.

On a pi, if you run `i2cdetect` it should look like this (with `3c` being my OLED.) If not, you may need to adjust the code or ensure you are all setup right.

```
i2cdetect -y 1
     0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
00:                         -- -- -- -- -- -- -- --
10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
30: -- -- -- -- -- -- -- -- -- -- -- -- 3c -- -- --
40: -- 41 -- -- -- -- -- -- -- 49 -- -- -- -- -- --
50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
70: -- -- -- -- -- -- -- --
```

Make sure to add this to your `/boot/firmware/config.txt`:

```
# dtparam=i2c_arm=on,i2c_arm_baudrate=50000
# dtparam=i2c_arm=on,i2c_arm_baudrate=100000
# dtparam=i2c_arm=on,i2c_arm_baudrate=400000
dtparam=i2c_arm=on,i2c_arm_baudrate=1000000
```

### TODO

- make this work with more images-settings like at [image2cpp](https://javl.github.io/image2cpp/)
- output single frame images (png/jpg/etc) as well as gif
- output more types of code?