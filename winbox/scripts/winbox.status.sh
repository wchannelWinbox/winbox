#!/bin/bash
# FIX FILE PERMISSIONS
chown -R winbox:winbox /home/winbox/winbox
chmod -R 664 /home/winbox/winbox
chmod -R ug+X /home/winbox/winbox
chmod a+x /home/winbox/winbox/scripts/winbox*

# SYSTEM STATUS
HDD_TOTAL=$(df -B M /home/winbox/winbox | awk 'FNR == 2 {print $2}' | sed 's/M//g')
HDD_CURRENT=$(df -B M /home/winbox/winbox | awk 'FNR == 2 {print $3}' | sed 's/M//g')
RAM_TOTAL=$(free -m | awk 'FNR == 2 {print $2}')
RAM_CURRENT=$(free -m | awk 'FNR == 2 {print $3}')

# NETWORK STATUS
NET=$(ping -c 5 google.com | grep -oP '\d+(?=% packet loss)')
[ "$NET" == "0" ] && NET="connected" || NET="disconnected"
IP=$(/sbin/ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p')
MAC=$(/sbin/ifconfig | grep -Eo '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}')

# WRITE TO FILE
HDD='{"current":'$HDD_CURRENT',"total":'$HDD_TOTAL'}'
RAM='{"current":'$RAM_CURRENT',"total":'$RAM_TOTAL'}'
NET='{"status":"'$NET'","ip":"'$IP'","mac":"'$MAC'"}'
echo '{"hdd":'$HDD',"ram":'$RAM',"network":'$NET'}' > /home/winbox/winbox/data/status.json
