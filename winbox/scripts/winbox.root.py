#!/usr/bin/env python
import os, time, json, getpass

__HOME__   = "/home/winbox/winbox"
__SCRIPT__ = True

try:
	while __SCRIPT__:
		if os.path.isfile(__HOME__ + "/data/config.json"):
			CONFIG = json.loads( open(__HOME__ + "/data/config.json", "r").read() )
		else:
			CONFIG = {"host":"","winbox":{"license":"","version":"10.0.0-201704"}}
		
		os.system("clear")
		print "\n\033[1;32m"
		print " =================================================="
		print "  WINBOX ADMINISTRATION TOOL                       "
		print " =================================================="
		
		print "\033[0;1m"
		print "    System information\033[0m"
		print "      Media server     " + CONFIG["host"]
		print "      License number   " + CONFIG["winbox"]["license"]
		print "      Current version  " + CONFIG["winbox"]["version"]
		
		print "\033[0;1m"
		print "    Choose action\033[0m"
		print "      1. Reboot winbox"
		print "      2. Remove license"
		print "      3. Remove media files"
		print "      4. Force upgrade version"
		print "      5. Terminal mode\n"
		print "      6. Change Resolution\n"
		print "      7. Change Ip\n"
		print "      8. Ip DHCP\n"
		print "      9. Remove License (forced)\n"
		print "      0. Exit\n"
		
		option = raw_input("\033[0;1m    Choose your option: \033[0m")
		if option=="0":
			os.kill(os.getppid(), 9)
		elif option=="1":
			print "      Rebooting in 5 seconds..."
			time.sleep(5)
			os.system("reboot")
		elif option=="2":
			if os.path.isfile(__HOME__ + "/scripts/winbox.deactivate.py"):
				os.system("python " + __HOME__ + "/scripts/winbox.deactivate.py")
			else:
				print "      Can't remove license, winbox is inactive!"
				time.sleep(2.5)
		elif option=="3":
			os.system("rm -rf " + __HOME__ + "/data/logs/* " + __HOME__ + "/data/media/*")
			os.system("mkdir " + __HOME__ + "/data/media/laterales ")
			os.system("mkdir " + __HOME__ + "/data/media/inferiores ")
			os.system("mkdir " + __HOME__ + "/data/media/comunicados ")
			os.system("mkdir " + __HOME__ + "/data/media/demand ")

			os.system("cd " + __HOME__ + "/data; find . -type f ! -regex \".*/\(logs\|media\|.gitignore\|config.json\)\" -delete")
			print "      Media files removed!"
			time.sleep(2.5)
		elif option=="4":
			print "      Upgrading application..."
			os.system("python " + __HOME__ + "/scripts/winbox.upgrade.py --forced")
		elif option=="5":
			if open("/root/.password", "r").read()[:-1]==getpass.getpass("      Enter root security password: "):
				print "\n\033[1;31m    WARNING: \033[0mEntering terminal mode as root, be careful!\n"
				time.sleep(2.5)
				__SCRIPT__ = False
		elif option=="6":
			print "      Changes will aply after reboot..."
			os.system("mv " + __HOME__ + "/scripts/winbox.run.sh " + __HOME__ + "/scripts/winbox.run_1.sh ")
			os.system("mv " + __HOME__ + "/scripts/winbox.run_2.sh " + __HOME__ + "/scripts/winbox.run.sh ")
			os.system("mv " + __HOME__ + "/scripts/winbox.run_1.sh " + __HOME__ + "/scripts/winbox.run_2.sh ")
			print "      Rebooting in 5 seconds..."
			time.sleep(5)
			os.system("reboot")
		elif option=="7":
			ip = raw_input("\033[0;1m    Ip Address in format (192.168.1.1): \033[0m")
			mac = raw_input("\033[0;1m    Mac Adress in format (255.255.255.0): \033[0m")
			gate = raw_input("\033[0;1m    Gateway in format (192.168.1.1): \033[0m")
			dns1 = raw_input("\033[0;1m    Main DNS (8.8.8.8): \033[0m")
			dns2 = raw_input("\033[0;1m    Secundary DNS (8.8.4.4): \033[0m")
			adaptador = raw_input("\033[0;1m    Adaptador de Red (enps01): \033[0m")
			os.system('echo "# interfaces(5) file used by ifup(8) and ifdown(8)" > /etc/network/interfaces')
			os.system('echo "auto lo" >> /etc/network/interfaces')
			os.system('echo "iface lo inet loopback" >> /etc/network/interfaces')
			os.system('echo "auto '+adaptador+'" >> /etc/network/interfaces')
			os.system('echo "iface '+adaptador+' inet static" >> /etc/network/interfaces')
			os.system('echo "address '+ip+'" >> /etc/network/interfaces')
			os.system('echo "netmask '+mac+'" >> /etc/network/interfaces')
			os.system('echo "gateway '+gate+'" >> /etc/network/interfaces')
			os.system('echo "dns-nameservers '+dns1+' '+dns2+'" >> /etc/network/interfaces')
			print "      Rebooting in 5 seconds..."
			time.sleep(5)
			os.system("reboot")
		elif option=="8":
			os.system('echo "# interfaces(5) file used by ifup(8) and ifdown(8)" > /etc/network/interfaces')
			os.system('echo "auto lo" >> /etc/network/interfaces')
			os.system('echo "iface lo inet loopback" >> /etc/network/interfaces')
			os.system('echo "#auto " >> /etc/network/interfaces')
			os.system('echo "#iface  inet static" >> /etc/network/interfaces')
			os.system('echo "#address " >> /etc/network/interfaces')
			os.system('echo "#netmask " >> /etc/network/interfaces')
			os.system('echo "#gateway " >> /etc/network/interfaces')
			os.system('echo "#dns-nameservers " >> /etc/network/interfaces')
			print "      Rebooting in 5 seconds..."
			time.sleep(5)
			os.system("reboot")
		elif option=="9":
			if os.path.isfile(__HOME__ + "/scripts/winbox.deactivate_forced.py"):
				os.system("python " + __HOME__ + "/scripts/winbox.deactivate_forced.py")
			else:
				print "      Can't remove license, winbox is inactive!"
				time.sleep(2.5)

except:
	os.kill(os.getppid(), 9)
