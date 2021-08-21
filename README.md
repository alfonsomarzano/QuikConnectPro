# Welcome to QuikConnect Pro

QuikConnectPro is a small helpful utility to help you quickly connect with your network resources over a number of different protocols.

![app screenshot](https://i.imgur.com/6gOb8hj.png)


# Supported Protocols

 - SSH (with Key or Password)
 - RDP (with File or inline credentials)
 - Telnet
 - HTTP
 - HTTPS
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
