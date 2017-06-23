#!/bin/bash
# INFINITE LOOP TO CHECK IF FIREFOX IS RUNNING
if [ "$1" == "--check" ]; then
	while true; do
		pid=$(ps -o pid= -p $(cat /home/winbox/winbox/data/.firefox.pid))
		if [ "$?" != "0" ]; then
			pkill firefox; firefox -private-window -P "default" http://127.0.0.1/ &
			echo $! > /home/winbox/winbox/data/.firefox.pid; sleep 4;
			echo -e $(date +'[%F %T]')" [INFO]  Winbox application is now running!" >> /home/winbox/winbox/data/logs/$(date +'%F').log
		fi
		sleep 1
	done
fi

# ADJUST DISPLAY SETTINGS
gtf 1280 720 60 | grep "Modeline .*" | sed -e 's/  Modeline //g' | xargs xrandr --newmode
xrandr | grep ".* connected" | sed -e 's/ connected.*//g' | tr -d '\n' | xargs -0 -I name xrandr --addmode name 1280x720_60.00
#xrandr | grep ".* connected" | sed -e 's/ connected.*//g' | tr -d '\n' | xargs -0 -I name xrandr --output name --mode 1280x720_60.00

# KILL AND EXECUTE FIREFOX
pkill firefox; firefox -private-window -P "default" http://127.0.0.1/ &
echo $! > /home/winbox/winbox/data/.firefox.pid; bash /home/winbox/winbox/scripts/winbox.run.sh --check &
echo -e $(date +'[%F %T]')" [INFO]  Winbox application is now running!" >> /home/winbox/winbox/data/logs/$(date +'%F').log
