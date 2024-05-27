This will create a little program that will show an animated splash-screen on a 128x64 OLED, on a pi, in C.

Here is how to use it on the pi:

Make sure to add this to your `/boot/firmware/config.txt`:

```
# dtparam=i2c_arm=on,i2c_arm_baudrate=50000
# dtparam=i2c_arm=on,i2c_arm_baudrate=100000
# dtparam=i2c_arm=on,i2c_arm_baudrate=400000
dtparam=i2c_arm=on,i2c_arm_baudrate=1000000
```

Then run this:

```
# install deps
sudo apt install libi2c-dev build-essential

# build it
make

# run it
./splash
```
