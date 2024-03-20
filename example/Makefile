splash: SSD1306_OLED_RPI-1.6.1
	g++ src/*.cpp SSD1306_OLED_RPI-1.6.1/*.cpp -I./SSD1306_OLED_RPI-1.6.1/include -o splash

SSD1306_OLED_RPI-1.6.1:
	curl -sL https://github.com/gavinlyonsrepo/SSD1306_OLED_RPI/archive/1.6.1.tar.gz | tar xz
	cd SSD1306_OLED_RPI-1.6.1 && make && sudo make install