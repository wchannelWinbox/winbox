#!/bin/bash

line="* * * * * DISPLAY=:0 xdotool mousemove 1280 730"
linee="* * * * * DISPLAY=:0 xdotool mousemove 0 730 click 1"
(crontab -r -u winbox; crontab -u winbox -l; echo "$line" ) | crontab -u winbox -
(crontab -u winbox -l; echo "$linee" ) | crontab -u winbox -
