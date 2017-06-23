#!/usr/bin/env python
import os, sys, time, json, requests

def LOG( type, message ):
	s = (time.strftime("[%Y-%m-%d %H:%M:%S]") + " [" + type + "]").ljust(30, " ")
	if os.path.isfile(__HOME__ + "/data/logs/" + time.strftime("%F.log")) and message.startswith("\n"):
		s = "\n" + s
	with open(__HOME__ + "/data/logs/" + time.strftime("%F.log"), "a") as f:
		f.write(s + message.replace("\n", "") + "\n")

__HOME__ = "/home/winbox/winbox"

CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )
if "host" not in CONFIG or CONFIG["host"]=="":
	exit()
URL = CONFIG["host"] + "/winbox/upgrade"
if len( sys.argv )!=2 or sys.argv[1]!="--forced":
	LOG("WARN", "Upgrading winbox firmware...")
	URL = URL + "?licencia=" + CONFIG["winbox"]["license"]
else:
	LOG("WARN", "Force upgrading winbox firmware...")

try:
	version = requests.get( URL ).json()
	v_addr  = CONFIG["host"] + "/files/707-" + str(version["id"]) + "-installer_file/" + version["file"]
	os.system("cd /home/winbox; rm -rf winbox/data/.upgrade winbox.zip; wget -c --read-timeout=300 --tries=5 \"" + v_addr + "\" -O winbox.zip")
	if not os.path.isfile("/home/winbox/winbox.zip") or os.path.getsize("/home/winbox/winbox.zip")==0:
		exit()
	os.system("cd /home/winbox; unzip -o winbox.zip; rm -rf winbox.zip;")
	if os.path.isfile(__HOME__ + "/data/.free"):
		os.system("cp " + __HOME__ + "/data/.free_winbox.run.sh " + __HOME__ + "/scripts/winbox.run.sh")
	LOG("WARN", "=> Current winbox firmware is " + version["version"])
except:
	LOG("ERROR", "=> Winbox didn't upgrade succesfully!")

open(__HOME__ + "/winbox.update.php", "w").write("<?php unlink(__FILE__);")
os.system("bash /home/winbox/winbox/scripts/winbox.status.sh;")
os.system("service apache2 restart; service lightdm restart; clear;")
