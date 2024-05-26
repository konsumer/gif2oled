This will create a little program that will show an animated splash-screen on a 128x64 OLED, on a pi, in C.

Here is how to use it on the pi:

```
# install C compiler
sudo apt install -y build-essential libcap2 libcap-dev

# add user to kmem group & setup permissions
sudo adduser $USER kmem
echo 'SUBSYSTEM=="mem", KERNEL=="mem", GROUP="kmem", MODE="0660"' | sudo tee /etc/udev/rules.d/98-mem.rules
sudo reboot

# get deps
cd /tmp
curl -sL http://www.airspayce.com/mikem/bcm2835/bcm2835-1.75.tar.gz | tar xz
cd bcm2835-1.75 && ./configure && make && sudo make install

cd /tmp
curl -sL https://github.com/gavinlyonsrepo/SSD1306_OLED_RPI/archive/1.6.1.tar.gz | tar xz
cd SSD1306_OLED_RPI-1.6.1 && make && sudo make install


# compile the code!
make

# run it!
sudo ./splash
```

I am using [SSD1306_OLED_RPI](https://github.com/gavinlyonsrepo/SSD1306_OLED_RPI). It can do a bunch of cool stuff with this OLED, so go check it out.
