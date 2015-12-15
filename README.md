# Entrust Agent
## Rest API

When the agent container is running on your plaform the port 8080 will be used
to communicate with the api.

### Interface

/login/APIKEY => must be called first, will return the topic prefix ( tenant/id )
/api/key => The body of the request can any json encoded object, will be send to mqtt server
