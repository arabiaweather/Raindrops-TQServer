TQServer - ALPHA
========

Transactional Queue Server Built with NodeJS

The main usecase TQServer taks into consideration is high content integration and also mantaining fast processing of requests.
By both utilizing the non-Blocking I/O of Nodejs and the Async methods TQServer makes sure to push data fast, serve it fast 
And still give the client the Transactionl Data Integrity methods to either commit a Pop or Rollit back. 

TQServer is very easy to setup and use and does not require hard work to get it up and running, it also has a very small 
footprint to keep it fast, and not to take up alot of server resources. 

Installation
---

1- Simply just clone the project to the required path

    $ git clone git@github.com:arabiaweather/TQServer.git

2- Edit the configuration files 

    Goto ./config/main.json
    {
        "ips":["127.0.0.1"], // List of IPs that are allowed to use TQServer
        "port":"8080" // The Port that TQServer will use
    }
    
    Goto ./config/notify.json
    {
        alowNotify": true, // Allow push notification on Push to Queue to a url or not 
        "url": "http://www.arabiaweather.com" // URL that will accept the GET call to be notified 
    }

3- Use Forever to get it up and running 
    
    Goto project root
    $ npm install forever -g
    $ forever start app.js
    
REST API
-

1) Push To Queue Server 
------

Allows you to push a JSON object to the queue, your json object needs to be wrapped in a data object so that it is stored and accessed correctly by TQServer

    Method: POST
    URL: http://localhost:8080/push
    Header: Content-Type:application/json
    Payload: {"data":{'YOUR-JSON-DATA'}}
    Response: 201 if create correctly
              406 if Payload not structured correctly

2) Pop From Queue
------

Allows you to pop and item from the queue, the body returned will contain your pushed json object without the data wrapper provided in the push. The pop method will be automatically Commited and you will not be able to rollback, for a Transactional Pop use tpop described below. 

    Method: GET 
    URL: http://localhost/pop
    Response: 200 if popped correctly, 204 if Queue is Empty  
    Response Body: {YOUR-JSON-DATA}
    
3) Transactional Pop
------

Transactional Pop will allow you to pop an item, if you are satisfied with the pop and want it final you can commit it using below REST API Call, or if you want to rollback you can do so using below REST API call. You will need to use the Commit Key to Commit or Rollback. Incase you commit the item pop is final, if you rollback the item will be placed on top of the queue to be processed again. 

    Method: GET
    URL: http://localhost/tpop
    Response: 200 if popped correctly, 204 if Queue is Empty 
    Response Body: {data:{YOUR-JSON-DATA-HERE}, commitKey:{Key-To-Use-To-Commit-Or-Roleback}}
    
4) Commit Transactional Pop
------

If you use transactional Pop you will can commit final changes using this api call. You will need to commit key to commit changes to that spesific pop. 

    Method: GET
    URL: http://localhost/commit/{Commit-Key}
    Response: 200 if commited correctly, 400 if key does not exist, 500 if commit was not successful 
    
5) Rollback Transactional Pop
------

This will allow you to rollback a Transactional Pop incase you need to get the item back. The item will be placed on top of the queue again for processing. 

    Method: GET
    URL: http://localhost/rollback/{Commit-Key}
    Response: 200 if rollback was successful, 400 if key does not exist, 500 if rollback failed

6) Get Length Of Queue 
------

This will allow the client to get the length of the Queue and item count, could be used to do long polling if notificatio is not wanted. 

    Method: GET 
    URL: http://localhost/length
    Response: 200 if executed correctly 
    Response Body: Integer representing length


TODO List 
---

- [ ] Create Test Client and automate testing of server to make sure all methods are correctly implemented and that data integrity is preseved
- [ ] Create rollbackAll REST call to roll back all non-commited tpops
- [ ] Create commitAll REST call to commit all non-commited tpops 
- [ ] Creat clearAll Rest call to clear all items in queue and non-commited items
- [ ] Fix notification to be POST and to send length count 
