#!/bin/bash
# SCRIPT MESSAGE HEADER
SCRIPT_HEADER="\033[1;31m[winbox.setup]\033[0m"

# CHANGE HOSTNAME
echo -e "${SCRIPT_HEADER} Changing hostname to winbox..."
sed -i -e 's/lubuntu/winbox/g' /etc/hostname /etc/hosts
hostname winbox; agetty --reload;

# WINBOX CONFIGURATION
echo -e "${SCRIPT_HEADER} Configuring winbox files..."
echo "echo \"winbox login: root\"; su - root; exit 0;" > /home/winbox/.bashrc
cp /home/winbox/winbox/user.js /root/.mozilla/firefox/up6jjxrd.default/
cp /home/winbox/winbox/user.js /home/winbox/.mozilla/firefox/ayqdw006.default/

(echo "## WINBOX CRONTAB
MAILTO=\"\"
WINBOX=\"/home/winbox/winbox/scripts\"

* * * * * [ -f \$WINBOX/winbox.status.sh ] && bash \$WINBOX/winbox.status.sh
* * * * * [ -f \$WINBOX/winbox.cron.sh ] && bash \$WINBOX/winbox.cron.sh
* * * * * [ -f \$WINBOX/winbox.config.py ] && python \$WINBOX/winbox.config.py
* * * * * [ -f \$WINBOX/winbox.post-upgrade.py ] && python \$WINBOX/winbox.post-upgrade.py && rm -rf \$WINBOX/winbox.post-upgrade.py") | crontab -

cd /home/winbox/winbox; echo "{\"idxBloque\":-1,\"idxMedia\":-1}" > data/player.json;
[ ! -f data/config.json ] && python scripts/winbox.config.py && touch data/.upgrade;
if [ -f data/.upgrade ]; then
	echo -e "${SCRIPT_HEADER} Upgrading to latest version..."
	python scripts/winbox.upgrade.py
fi
