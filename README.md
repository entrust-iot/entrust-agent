# Entrust Agent

Here is a basic setup for a raspberry pi :

- Image your sd card with 0.6.1 of http://blog.hypriot.com/downloads/
- Boot up the pi
- Login with pi/raspberry
- Execute `sudo apt-get update`
- Execute `sudo apt-get install npm nodejs`
- ``sudo ln -s `which nodejs` /usr/bin/node``
- Execute `git clone https://github.com/entrust-iot/entrust-agent`
- Execute `git clone https://github.com/entrust-iot/entrust-device`
- Execute `cd entrust-agent`
- Install the following files in the src/security folder
  - `client.crt` client certificate
  - `client.key` client key
  - `ca.crt` CA certificate
- Execute `docker-compose build`
- Execute `docker-compose up`
- You can then use the second virtual terminal to start the device code.

## Rest API

When the agent container is running on your plaform the port 8080 will be used
to communicate with the api.

### Interface

- /login/APIKEY => must be called first, will return the topic prefix ( tenant/id )
- /api/key => The body of the request can any json encoded object, will be send to mqtt server
