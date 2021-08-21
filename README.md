# Welcome to QuikConnect Pro

QuikConnectPro is a small helpful utility to help you quickly connect with your network resources over a number of different protocols.

# New Features:
  - Added pinned resources. Configured manually by setting the Quick property in the json file to true.
  - Clicking enter on the search boxes will initiate a connection with the first element of the list.
  - Added SMB support through explorer.exe
  - If Protocol = HTP/HTS, the favicon is displayed instead of the protocol
  - Made the window much smaller so it looks more like a traywindow.


![app screenshot](https://i.imgur.com/6gOb8hj.png)


# Supported Protocols

 - SSH (with Key or Password)
 - RDP (with File or inline credentials)
 - Telnet
 - HTTP
 - HTTPS
 - SMB (through explorer.exe)
 - Custom Protocols coming soon (FormatCommand+IpOrDN) 
 - more coming soon

## Simple JSON Schema

Resources are stored in a JSON file with a simple schema:
For security reasons, the items.json file is not included in this repository and must be manually created inside the /app folder.
```json
[{
"ConnectionType": "SSH",
"Description": "samba-master",
"IpOrDN": "192.168.1.251",
"Quick": true,
"Creds": {
"Username": "",
"Password": "",
"Param3": "no"
	}
},]
```
