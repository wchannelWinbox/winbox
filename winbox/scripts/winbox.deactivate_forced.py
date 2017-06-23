#!/usr/bin/env python
import os, time, json, requests

def LOG( type, message ):
	s = (time.strftime("[%Y-%m-%d %H:%M:%S]") + " [" + type + "]").ljust(30, " ")
	if os.path.isfile(__HOME__ + "/data/logs/" + time.strftime("%F.log")) and message.startswith("\n"):
		s = "\n" + s
	with open(__HOME__ + "/data/logs/" + time.strftime("%F.log"), "a") as f:
		f.write(s + message.replace("\n", "") + "\n")

def WRITE_FILES():
	open(__HOME__ + "/data/.gitignore", "w").write("*\nlogs/*\nmedia/*\n!.gitignore\n!config.json")
	open(__HOME__ + "/winbox.update.php", "w").write("<?php unlink(__FILE__);")
	open(__HOME__ + "/winbox.activation.php", "w").write("\n".join([
		"""<?php""",
		"""if( $_SERVER["REQUEST_METHOD"]!="POST" ) { header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404); echo "<h1>404 Not Found</h1>"; exit(); }\n""",
		"""$WINBOX = "/home/winbox/winbox"; file_put_contents("$WINBOX/data/config.json", json_encode($_POST));""",
		"""file_put_contents("$WINBOX/data/logs/".date("Y-m-d").".log", date("[Y-m-d H:i:s]")." [INFO]  Winbox license is now ACTIVE!\n", FILE_APPEND);""",
		"""unlink(__FILE__);"""
	]))
	os.system("chown winbox:winbox " + __HOME__ + "/winbox.update.php")
	os.system("chown winbox:winbox " + __HOME__ + "/winbox.activation.php")

__HOME__ = "/home/winbox/winbox"

if not os.path.isfile(__HOME__ + "/data/config.json"):
	exit()
	
CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )
if CONFIG["winbox"]["id"]==0 or CONFIG["winbox"]["license"]=="":
	exit()

os.system("rm -rf " + __HOME__ + "/data/*; mkdir " + __HOME__ + "/data/media; mkdir " + __HOME__ + "/data/logs; mkdir "+ __HOME__ + "/data/media/inferiores; mkdir "+ __HOME__ + "/data/media/laterales; mkdir "+ __HOME__ + "/data/media/comunicados mkdir "+ __HOME__ + "/data/media/demand;")
s1, s2, s3 = "{\"host\":\"", "\",\"winbox\":{\"id\":0,\"license\":\"\",\"version\":\"", "\"},\"channel\":{}}"
open(__HOME__ + "/data/config.json", "w").write(s1 + CONFIG["host"] + s2 + CONFIG["winbox"]["version"] + s3)
print "      Winbox license is now inactive!"
LOG("WARN", "Winbox license is now inactive!")
WRITE_FILES()
os.system("service apache2 restart; service lightdm restart;")
