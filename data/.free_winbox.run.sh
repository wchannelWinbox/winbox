#!/bin/bash
# INFINITE LOOP TO CHECK IF FIREFOX IS RUNNING
if [ "$1" == "--check" ]; then
	while true; do
		pid=$(pidof firefox);
		if [ "$pid" == "" ]; then
			pkill firefox; rm -f /home/winbox/.mozilla/firefox/ayqdw006.default/.parentlock; rm -f /home/winbox/.mozilla/firefox/ayqdw006.default/lock;
			rm -f /root/.mozilla/firefox/up6jjxrd.default/.parentlock; rm -f /root/.mozilla/firefox/up6jjxrd.default/lock; sleep 2; firefox -private-window -P "default" http://127.0.0.1/ 
#			echo $! > /home/winbox/winbox/data/.firefox.pid; sleep 4;
#			echo -e $(date +'[%F %T]')" [INFO]  Winbox application is now running!" >> /home/winbox/winbox/data/logs/$(date +'%F').log
		fi
		sleep 2
	done
fi

# ADJUST DISPLAY SETTINGS
gtf 1280 720 60 | grep "Modeline .*" | sed -e 's/  Modeline //g' | xargs xrandr --newmode
xrandr | grep ".* connected" | sed -e 's/ connected.*//g' | tr -d '\n' | xargs -0 -I name xrandr --addmode name 1280x720_60.00
xrandr | grep ".* connected" | sed -e 's/ connected.*//g' | tr -d '\n' | xargs -0 -I name xrandr --output name --mode 1280x720_60.00


# KILL AND EXECUTE FIREFOX
sleep 20;
pkill firefox; firefox -private-window -P "default" http://127.0.0.1/
#echo $! > /home/winbox/winbox/data/.firefox.pid;
bash /home/winbox/winbox/scripts/winbox.run.sh --check &
echo -e $(date +'[%F %T]')" [INFO]  Winbox application is now running!" >> /home/winbox/winbox/data/logs/$(date +'%F').log
