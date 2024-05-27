This will create a little program that will show an animated splash-screen on a 128x64 OLED, on a pi, in C.

Here is how to use it on the pi:

```
# install deps
sudo apt install libi2c-dev libstb-dev build-essential 

# build it
make

# run it
./splash
```

[My oled lib](https://github.com/konsumer/pipd/tree/main/drivers) can do lots more with images (load still images directly, etc) and more, like text & drawing, but this is a quick example to see it loading a gif.
