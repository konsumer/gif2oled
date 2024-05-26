I wanted to make an efficient splash screen that can start really early in pizero boot, on an OLED screen.

This will generate the C code to do this, as well as micropython code, and arduino code, for other targets.

It can also generate code for micropython & arduino.

Once you have built your header, check out [examples](examples) to see how to use it. There are lots of ways to display images on OLED displays, and most devices have a way to do it n C or micropython, so you should be able to combine these ideas to work on any device, however you prefer.


### TODO

- make this work with more images-settings like at [image2cpp](https://javl.github.io/image2cpp/)
- output single frame images (png/jpg/etc) as well as gif
- output more types of code?
- I could probly use `gif-encoder-2` for display, too