#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os, time, json, requests, feedparser

def LOG( type, message ):
	s = (time.strftime("[%Y-%m-%d %H:%M:%S]") + " [" + type + "]").ljust(30, " ")
	if os.path.isfile(__HOME__ + "/data/logs/" + time.strftime("%F.log")) and message.startswith("\n"):
		s = "\n" + s
	with open(__HOME__ + "/data/logs/" + time.strftime("%F.log"), "a") as f:
		f.write(s + message.replace("\n", "") + "\n")

def ADDED( old, new ):
	set_old, set_new = set(old.keys()), set(new.keys())
	intersect = set_new.intersection(set_old)
	for item in (set_new-intersect):
		LOG("INFO", "   => Added CONFIG." + item)

def REMOVED( old, new ):
	set_old, set_new = set(old.keys()), set(new.keys())
	intersect = set_new.intersection(set_old)
	for item in (set_old-intersect):
		LOG("INFO", "   => Removed CONFIG." + item)

def CHANGED( old, new, prefix="" ):
	set_old, set_new = set(old.keys()), set(new.keys())
	intersect = set_new.intersection(set_old)
	for item in set(k for k in intersect if old[k]!=new[k]):
		if type(old[item]) is dict and type(new[item]) is dict:
			CHANGED( old[item], new[item], ((prefix+".") if prefix!="" else "") + item )
		else:
			LOG("INFO", "   => Changed CONFIG." + ((prefix+".") if prefix!="" else "") + item)
			LOG("INFO", "      => Old value: " + str(old[item]))
			LOG("INFO", "      => New value: " + str(new[item]))

__HOME__ = "/home/winbox/winbox"

## IF CONFIG DOESN'T EXIST, CREATE DEFAULT FILE
if not os.path.isfile(__HOME__ + "/data/config.json"):
	a = "{\"host\":\"http://wchannel.windowschannelfactory.com\",\"winbox\":{\"id\":0,\"license\":\"\",\"version\":\""
	b = "\"},\"channel\":{},\"date_format\":\"MMM D, YYYY\",\"time_format\":\"hh:mm A\"}"
	open(__HOME__ + "/data/config.json", "w").write(a + "8.0.4-20161027" + b)
	LOG("WARN", "Write default configuration!")
CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )

## IF WINBOX IS NOT ACTIVE, CREATE ACTIVATION ENDPOINT
if ("id" not in CONFIG["winbox"]) or CONFIG["winbox"]["id"]==0:
	if not os.path.isfile(__HOME__ + "/winbox.activation.php"):
		open(__HOME__ + "/winbox.activation.php", "w").write("\n".join([
			"""<?php""",
			"""if( $_SERVER["REQUEST_METHOD"]!="POST" ) { header($_SERVER["SERVER_PROTOCOL"]." 404 Not Found", true, 404); echo "<h1>404 Not Found</h1>"; exit(); }\n""",
			"""$WINBOX = "/home/winbox/winbox"; file_put_contents("$WINBOX/data/config.json", json_encode($_POST));""",
			"""file_put_contents("$WINBOX/data/logs/".date("Y-m-d").".log", date("[Y-m-d H:i:s]")." [INFO]  Winbox license is now ACTIVE!", FILE_APPEND);""",
			"""unlink(__FILE__);"""
		]))
		os.system("chown winbox:winbox " + __HOME__ + "/winbox.activation.php")
		LOG("INFO", "Waiting for winbox activation...")
	exit()

## MAKE CONFIG REQUEST TO CMS. EXIT SCRIPT IF UNSUCCESFUL
os.system("rm -rf " + __HOME__ + "/winbox.activation.php")
r = requests.get(CONFIG["host"] + "/winbox/config", params={
	"id":CONFIG["winbox"]["id"], "licencia":CONFIG["winbox"]["license"], "fecha":time.strftime("%d/%m/%Y"), "hora":time.strftime("%H:%M:00")
}).json()

if not r["success"]:
	exit()


## LOG IF CONFIGURATION FILE IS DIFFERENT
if cmp(CONFIG, r["result"])!=0:
	LOG("INFO", "Fetching configuration...")
	time.sleep(1)
	LOG("INFO", "=> Winbox configuration updated!")
	ADDED( CONFIG, r["result"] )
	REMOVED( CONFIG, r["result"] )
	CHANGED( CONFIG, r["result"] )


## SKIP FLV FILES FROM CHANNEL BLOCKS
if "blocks" in r["result"]["channel"]:
	for block in r["result"]["channel"]["blocks"]:
		block["media"] = [media for media in block["media"] if media["type"]!="video" or not media["value"].endswith(".flv")]


CONFIG = r["result"]
open(__HOME__ + "/data/config.json", "w").write( json.dumps(CONFIG, indent=2, separators=(",",":")) )



try:
	## UPDATE COMUNICADOS
	CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )
	COMUNICADO = json.loads( open(__HOME__ + "/data/comunicado.json", "r").read() )
	data_string = json.dumps(CONFIG["channel"]["comunicados"])
	##LOG("INFOlog", data_string)
	for comunicado in CONFIG["channel"]["comunicados"]:
		LOG("INFO", str(comunicado["id"]))
		coloso = 0
		for comunicado_cargado in COMUNICADO:
			if str(comunicado["id"])==str(comunicado_cargado["id"]):
				coloso = 1
		
		if coloso==0:
			COMUNICADO.append( {"reproducido":"no","id":comunicado["id"] ,"value":comunicado["value"],"time":comunicado["time"],"text":comunicado["text"],"type":comunicado["type"],"duration":comunicado["duration"]} )
			
		##if comunicado["id"] not in COMUNICADO:
			##COMUNICADO.append( comunicado["id"]:{"title":"prueba"} )

		open(__HOME__ + "/data/comunicado.json", "w").write( json.dumps(COMUNICADO, indent=2, separators=(",",":")) )
except:
	open(__HOME__ + "/data/comunicado.json", "w").write( "[]" )		
##LOG("INFO", "=> hasta aca")

try:
	## UPDATE URL
	CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )
	URL = json.loads( open(__HOME__ + "/data/url.json", "r").read() )
	data_string = json.dumps(CONFIG["channel"]["url"])
	##LOG("INFOlog", str(CONFIG["channel"]["url"]['enabled']))
	if URL:
		coloso = 0
		if CONFIG["channel"]["url"]['value']==URL[0]["url"] and str(CONFIG["channel"]["url"]['duracion_url']) == URL[0]["duracion_url"]:
			coloso = 1

		if str(CONFIG["channel"]["url"]['enabled']) == 'True' and coloso == 0:
			URL[0]['url'] = CONFIG["channel"]["url"]['value'];
			URL[0]['reproducido'] = 'no';
			URL[0]['duracion_url'] = str(CONFIG["channel"]["url"]['duracion_url']);
	else:
		URL.append( {"reproducido":"no","url":CONFIG["channel"]["url"]['value'],"duracion_url":str(CONFIG["channel"]["url"]['duracion_url'])} )

	open(__HOME__ + "/data/url.json", "w").write( json.dumps(URL, indent=2, separators=(",",":")) )
except:
	open(__HOME__ + "/data/url.json", "w").write( "[]" )	

try:
	## UPDATE COMUNICADOS
	innferior = json.loads( open(__HOME__ + "/data/inferior.json", "r").read() )

except:
	open(__HOME__ + "/data/inferior.json", "w").write( '{"actual":0}' )	


try:
	## UPDATE COMUNICADOS
	lateral = json.loads( open(__HOME__ + "/data/lateral.json", "r").read() )

except:
	open(__HOME__ + "/data/lateral.json", "w").write( '{"actual":0}' )	
## UPDATE NEWS CONFIGURATION
try:
	news, news_json = feedparser.parse( CONFIG["host"] + "/noticias.xml?canal=" + str(CONFIG["channel"]["id"]) ), []
	news_string = ''
	for entry in news["entries"]:
		news_json.append( {"title":entry["title"], "description":entry["summary"]} )
		news_string_full = ''

		if entry["title"] != '' and entry["summary"] == '':
			news_string_full = entry["title"]

		if entry["title"] == '' and entry["summary"] != '':
			news_string_full = entry["summary"]

		if entry["title"] != '' and entry["summary"] != '':
			news_string_full = entry["title"] + ': ' + entry["summary"]

		if news_string == '':
			news_string = news_string_full
		else:
			news_string = news_string + ' - ' + news_string_full
	try:
		if cmp(json.loads(open(__HOME__ + "/data/news.json", "r").read()), news_json)!=0:
			LOG("INFO", "=> News data updated!")

		if cmp(json.loads(open(__HOME__ + "/data/news_string.json", "r").read()), news_string)!=0:
			LOG("INFO", "=> News data updated!")
	except:
		pass
	open(__HOME__ + "/data/news.json", "w").write( json.dumps(news_json, indent=2, separators=(",",":")) )
	open(__HOME__ + "/data/news_string.json", "w").write( json.dumps(news_string, indent=2, separators=(",",":")) )
except:
	open(__HOME__ + "/data/news.json", "w").write( "[]" )
	open(__HOME__ + "/data/news_string.json", "w").write( "[]" )

## UPDATE RSS CONFIGURATION
if CONFIG["channel"]["rss"]:
	try:
		rss, rss_json = feedparser.parse( CONFIG["channel"]["rss"][0]["value"] ), []
		rss_string = ''
					
		for entry in rss["entries"]:
			rss_json.append( entry["title"] )
			if rss_string == '':
				rss_string = entry["title"]
			else:
				rss_string = rss_string + ' - ' + entry["title"]
		try:
			if cmp(json.loads(open(__HOME__ + "/data/rss.json", "r").read()), rss_json)!=0:
				LOG("INFO", "=> RSS data updated!")

			if cmp(json.loads(open(__HOME__ + "/data/rss_string.json", "r").read()), rss_string)!=0:
				LOG("INFO", "=> RSS data updated!")
		except:
			pass
		open(__HOME__ + "/data/rss.json", "w").write( json.dumps(rss_json, indent=2, separators=(",",":")) )
		open(__HOME__ + "/data/rss_string.json", "w").write( json.dumps(rss_string, indent=2, separators=(",",":")) )
	except:
		open(__HOME__ + "/data/rss.json", "w").write( "[]" )
		open(__HOME__ + "/data/rss_string.json", "w").write( "[]" )

## UPDATE RSS2 CONFIGURATION
if CONFIG["channel"]["rss2"]:
	try:
		rss2, rss_json2 = feedparser.parse( CONFIG["channel"]["rss2"][0]["value"] ), []
		rss_string2 = ''
					
		for entry in rss2["entries"]:
			rss_json2.append( entry["title"] )
			if rss_string2 == '':
				rss_string2 = entry["title"]
			else:
				rss_string2 = rss_string2 + ' - ' + entry["title"]
		try:
			if cmp(json.loads(open(__HOME__ + "/data/rss2.json", "r").read()), rss_json2)!=0:
				LOG("INFO", "=> RSS2 data updated!")

			if cmp(json.loads(open(__HOME__ + "/data/rss_string2.json", "r").read()), rss_string2)!=0:
				LOG("INFO", "=> RSS2 data updated!")
		except:
			pass
		open(__HOME__ + "/data/rss2.json", "w").write( json.dumps(rss_json2, indent=2, separators=(",",":")) )
		open(__HOME__ + "/data/rss_string2.json", "w").write( json.dumps(rss_string2, indent=2, separators=(",",":")) )
	except:
		open(__HOME__ + "/data/rss2.json", "w").write( "[]" )
		open(__HOME__ + "/data/rss_string2.json", "w").write( "[]" )

os.system("python " + __HOME__ + "/scripts/winbox.download.py")

if "update" in CONFIG["winbox"] and CONFIG["winbox"]["update"]:
	LOG("WARN", "Winbox will be upgraded on next reboot")
	os.system("python " + __HOME__ + "/scripts/winbox.upgrade.py --forced")
if "reboot" in CONFIG["winbox"] and CONFIG["winbox"]["reboot"]:
	LOG("WARN", "Winbox will be rebooted...")
	os.system("/sbin/reboot")
if "media" in CONFIG["winbox"] and CONFIG["winbox"]["media"]:
	os.system("rm -rf " + __HOME__ + "/data/logs/* " + __HOME__ + "/data/media/*")
	os.system("mkdir " + __HOME__ + "/data/media/laterales ")
	os.system("mkdir " + __HOME__ + "/data/media/inferiores ")
	os.system("mkdir " + __HOME__ + "/data/media/comunicados ")
	os.system("mkdir " + __HOME__ + "/data/media/demand ")

	os.system("cd " + __HOME__ + "/data; find . -type f ! -regex \".*/\(logs\|media\|.gitignore\|config.json\)\" -delete")
	LOG("WARN", "Media files removed!")
