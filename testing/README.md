#####Use Node 0.12.x or 4.x for running compatible with selenium-webdriver. In case if you're using Node 0.12.x, you must run with the --harmony flag.

####Also use chromedriver v 2.21 if running with chrome browser. [http://chromedriver.storage.googleapis.com/index.html?path=2.21/](http://chromedriver.storage.googleapis.com/index.html?path=2.21/)

#### install chromedriver on linux

1) install xvfb so we can run Chrome headlessly
```
sudo apt-get install xvfb
```
2) Install ChromeDriver
```
sudo apt-get install unzip

wget -N http://chromedriver.storage.googleapis.com/2.20/chromedriver_linux64.zip
unzip chromedriver_linux64.zip
chmod +x chromedriver

sudo mv -f chromedriver /usr/local/share/chromedriver
sudo ln -s /usr/local/share/chromedriver /usr/local/bin/chromedriver
sudo ln -s /usr/local/share/chromedriver /usr/bin/chromedriver
```

#### install chromedriver for windows
1) Download [chromedriver for windows](http://chromedriver.storage.googleapis.com/2.21/chromedriver_win32.zip)

2) Copy chromedriver.exe to your PATH directory ("C:\\Windows\\system32" for example)

####Installation node modules. In current directory open console and then run:
```
sudo npm install -g gulp
npm install
cd testing
npm install
```

####To start application run in console
```
$ gulp
```
