var request = require('request');

for(var i = 0; i<10; i++)
{

var options = {
  uri: 'http://localhost:8080/push',
  method: 'POST',
  json: {
    "data": "{item:"+i+"}"
  }
};

request(options, function (error, response, body) {
  console.log(body);
});

}
