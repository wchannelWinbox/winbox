#!/usr/bin/env python
import os, time, json, requests

def LOG( type, message ):
	s = (time.strftime("[%Y-%m-%d %H:%M:%S]") + " [" + type + "]").ljust(30, " ")
	if os.path.isfile(__HOME__ + "/data/logs/" + time.strftime("%F.log")) and message.startswith("\n"):
		s = "\n" + s
	with open(__HOME__ + "/data/logs/" + time.strftime("%F.log"), "a") as f:
		f.write(s + message.replace("\n", "") + "\n")

def DOWNLOAD(title, ftype, url):
	URL    = CONFIG["host"] + url
	FILE_1 = __HOME__ + "/data/" + url.split("/")[-1]
	FILE_2 = __HOME__ + "/data/" + ftype + "-" + url.split("/")[-1]
	if not os.path.isfile(FILE_1) and not os.path.isfile(FILE_2):
		LOG("INFO", "=> Downloading " + title + ": " + url.split("/")[-1])
		COMMAND = "wget -c --read-timeout=300 --tries=5 \"" + URL + "\" -O \"" + FILE_1 + "\"; rm -rf " + title + "-*;"
		os.system( COMMAND + " mv \"" + FILE_1 + "\" \"" + FILE_2 + "\";" )
		if os.path.isfile(FILE_1) and os.path.getsize(FILE_1)==0:
			os.system("rm -rf " + FILE_1)
		if os.path.isfile(FILE_2) and os.path.getsize(FILE_2)==0:
			os.system("rm -rf " + FILE_2)

def CLEARCOMUNICADOS():
	path = "/home/winbox/winbox/data/media/comunicados/"

	dirs = os.listdir( path )

	filesdelete = []
	for filename in dirs:
		filesdelete.append(filename+ "&" +"si")

	for comunicado in CONFIG["channel"]["comunicados"]:
		
		if comunicado["type"] == "text":
			filetodelete = str(comunicado["id"])+"-p>"
		else:
			filetodelete = str(comunicado["id"])+"-"+comunicado["value"].split("/")[3]

		count=0
		for filedelete in filesdelete:
			if filedelete.split("&")[0] == filetodelete:
				filesdelete[count] = filedelete.split("&")[0]+ "&" +"no"

			count += 1
		
	for filedelete in filesdelete:
		if(filedelete.split("&")[1]=="si"):
			os.remove(path+filedelete.split("&")[0])


def WinboxDownload():
	if ("client_logo" in CONFIG) and ("type" in CONFIG["client_logo"]) and CONFIG["client_logo"]["type"]=="image":
		DOWNLOAD("client logo", "client_logo", CONFIG["client_logo"]["value"])

	if "channel" in CONFIG:
		if ("logo" in CONFIG["channel"]) and ("type" in CONFIG["channel"]["logo"]) and CONFIG["channel"]["logo"]["type"]=="image":
			DOWNLOAD("channel logo", "channel_logo", CONFIG["channel"]["logo"]["value"])
		if ("background" in CONFIG["channel"]) and CONFIG["channel"]["background"]["value"]!="":
			DOWNLOAD("channel background", "channel_background", CONFIG["channel"]["background"]["value"])
		if ("lateral" in CONFIG["channel"]) and CONFIG["channel"]["lateral"]["picture"]!="":
			DOWNLOAD("lateral picture", "lateral", CONFIG["channel"]["lateral"]["picture"])
			if ("bottom" in CONFIG["channel"]["lateral"]) and CONFIG["channel"]["lateral"]["bottom"]!="":
				DOWNLOAD("bottom picture", "bottom", CONFIG["channel"]["lateral"]["bottom"])

		for lateral in CONFIG["channel"]["imagenesLaterales"]:
			DOWNLOAD("lateral", "media/laterales/" + str(lateral["id"]), lateral["picture"])

		for inferior in CONFIG["channel"]["imagenesInferiores"]:
			DOWNLOAD("inferior", "media/inferiores/" + str(inferior["id"]), inferior["picture"])


		for comunicado in CONFIG["channel"]["comunicados"]:
			if comunicado["type"]=="video" and comunicado["value"].endswith(".flv") or (comunicado["type"]=="text" or comunicado["type"]=="streaming"):
				continue
			DOWNLOAD("comunicado", "media/comunicados/" + str(comunicado["id"]), comunicado["value"])

		for demand in CONFIG["channel"]["demand"]:
			if demand["type"]=="video" and demand["value"].endswith(".flv"):
				continue
			DOWNLOAD("demand", "media/demand/" + str(demand["id"]), demand["value"])
			DOWNLOAD("demand_preview", "media/demand/" + str(demand["id"]), "/files/12-"+str(demand["id"])+"-imagen_preview/imagen_preview.png")

		for block in CONFIG["channel"]["blocks"]:
			for media in block["media"]:
				if media["type"]=="video" and media["value"].endswith(".flv"):
					continue
				DOWNLOAD("media", "media/" + str(media["id"]), media["value"])

		CLEARCOMUNICADOS()

__HOME__ = "/home/winbox/winbox"

if not os.path.isfile(__HOME__ + "/data/config.json"):
	exit()

CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )
if CONFIG["winbox"]["id"]==0:
	exit()

WinboxDownload()
