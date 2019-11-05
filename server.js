var express = require('express');
var app = express();
var http = require('http');
var mongo = require('mongodb').MongoClient;
var url = "mongodb://jpa87:RLzG43im@127.0.0.1:27017/cmpt218_jpa87?authSource=admin";

//for event multi check-in functionality outside of assignment, create an array of check-in objects and
//new collection based on ID from object in the array.

function dynamicHTMLLanding(){
  var html = "<!DOCTYPE html>\n";
  var head = '';
  var body = '';
  head += "<head>";
  head += "<title>Admin Landing</title>\n";
  head += "<link rel = \"stylesheet\"  href = \"./css/style.css\">\n";
  head += "</head>\n";
  body += "<body>";
  body += "<h1>Admin Landing</h1>\n";
  body += "<section>\n";
  body += "<form action=\"/check-in\" method=\"post\">\n";
  body += "<input type=\"text\" id=\"checkin\" name=\"checkin\" placeholder=\"Check-in ID\" required/><br/>\n";
  body += "<input type=\"submit\" id=\"startCheckIn\" name=\"startCheckIn\" value=\"Start Check-in\"><br/>\n";
  body += "</form>\n";
  body += "<button onclick=\"viewHistory()\">View History</button>\n";
  body += "</section>\n";
  body += "You can click any row and it will be deleted<br/>";
  body += "<table></table>\n";
  body += "<script src=\"./js/jquery-3.3.1.js\"></script>\n";
  body += "<script src=\"./js/script.js\"></script>\n";
  body += "</body>\n";
  return html + "<html>\n" + head + body + "</html>";
}

function dynamicHTMLCheckIn(string){
  var html = "<!DOCTYPE html>\n";
  var head = '';
  var body = '';
  head += "<head>";
  head += "<title>Please Check In Now</title>\n";
  head += "<link rel = \"stylesheet\"  href = \"./css/style.css\">\n";
  head += "</head>\n";
  body += "<body>";
  body += "<h1>Please Check In Now</h1>\n";
  body += "<section>\n";
  body += "<p>Check-in ID<br/>\n";
  body += string;
  body += "</br></p>\n";
  body += "<form action=\"/stop-check-in\" method=\"post\">\n";
  body += "<input type=\"submit\" name=\"stopCheckIn\" value=\"Stop " + string + " Check-in\">\n";
  body += "</form>"
  body += "</section>\n";
  body += "<script src=\"./js/jquery-3.3.1.js\"></script>\n";
  body += "<script src=\"./js/script.js\"></script>\n";
  body += "</body>\n";
  return html + "<html>\n" + head + body + "</html>";
}

function dynamicHTMLThankYou(){
  var html = "<!DOCTYPE html>\n";
  var head = '';
  var body = '';
  head += "<head>";
  head += "<title>Please Check In Now</title>\n";
  head += "<link rel = \"stylesheet\"  href = \"./css/style.css\">\n";
  head += "</head>\n";
  body += "<body>\n";
  body += "<h1>Thank you for checking in!</h1>\n";
  body += "</body>\n";
  return html + "<html>\n" + head + body + "</html>";
}

function dynamicHTMLStopCheck(attendeeValue, attendeeList){
  var html = "<!DOCTYPE html>\n";
  var head = '';
  var body = '';
  head += "<head>";
  head += "<title>Check-in has stopped</title>\n";
  head += "<link rel = \"stylesheet\"  href = \"./css/style.css\">\n";
  head += "</head>\n";
  body += "<body>\n";
  body += "<h1>There were " + attendeeValue + " atendees</h1>\n";
  body += "<h2>You can delete the entry in the database by just clicking on the row</h2>\n";
  body += "<table>\n<tr>\n";
  body += "<th>Where you checked in</th>\n<th>Name</th>\n<th>ID</th>\n<th>Date</th>\n";
  attendeeList.forEach(function(data){
    body += "<tr class=\"table-insert\">\n";
    body += "<td>" + data.checkString + "</td>";
    body += "<td>" + data.name + "</td>";
    body += "<td>" + data.studentid + "</td>";
    body += "<td>" + data.date + "</td>";
    body += "</tr>\n";
  });
  body += "</table>\n";
  body += "<script src=\"./js/jquery-3.3.1.js\"></script>\n";
  body += "<script src=\"./js/script.js\"></script>\n";
  body += "</body>\n";
  return html + "<html>\n" + head + body + "</html>";
}

var checkInObject = {
  check: false,
  string: 'nothing',
  date: ''
};

var attendeeNumber = 0;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//log request
app.use('/', function(req,res,next){
  console.log(req.method, 'request:', req.url, JSON.stringify(req.body));
  next();
});

//serve static files
app.use('/', express.static(__dirname + '/'));

//serve login.html
app.get('/', function(request, response){
  response.status(200);
  response.sendFile(__dirname + '/login.html');
});

//admin login
app.post('/server.js', function(request, response){
  var user = request.body.user;
  var password = request.body.password;
  if(user == 'admin' && password == '1234'){
    var htmlString = dynamicHTMLLanding();
    response.status(200);
    response.send(htmlString);
  }else{
    console.log("Bad login info");
    response.status(200);
    response.sendFile(__dirname + '/login.html');
  }
});

//login for actual clients
app.post('/check-in-users', function(request, response){
  response.status(200);
  response.sendFile(__dirname + '/user.html');
});

//start check-in event
app.post('/check-in', function(request, response){
  var checkInId = request.body.checkin;
  if(checkInObject.check == false){
    var dateToday = (new Date()).toLocaleString();
    checkInObject.check = true;
    checkInObject.string = checkInId;
    checkInObject.date = dateToday;
    var checkInNow = {
      checkString: checkInId,
      name: 'admin',
      studentid: 'check in start',
      date: dateToday,
      isCheckIn: true
    };
    console.log(checkInId);
    mongo.connect(url, function(err, client){
      if(err) console.log(err);
      console.log('connected');
      var database = client.db('cmpt218_jpa87');
      var collection = database.collection('users');
      collection.insert(checkInNow);
    });
  }
  var htmlStringForCheckIn = dynamicHTMLCheckIn(checkInId);
  response.status(200);
  response.send(htmlStringForCheckIn);
});

//check-in users
app.post('/log-in-user', function(request, response){
  var user = {
    checkString: request.body.checkInString,
    name: request.body.name,
    studentid: request.body.userid,
    date: (new Date()).toLocaleString(),
    isCheckIn: false
  };
  var html = dynamicHTMLThankYou();
  if(user.checkString == checkInObject.string && checkInObject.check == true){
    mongo.connect(url, function(err, client){
      if(err) console.log(err);
      console.log('connected');
      var database = client.db('cmpt218_jpa87');
      var collection = database.collection('users');
      collection.insert(user);
      attendeeNumber++;
    });
    response.status(200);
    response.send(html);
  }else{
    response.status(401);
    response.sendFile(__dirname + '/user.html')
  }
});

//view history and append to file
app.post('/view-history', function(request, response){
  mongo.connect(url, function(err, client){
    if(err) console.log(err);
    console.log('connected');
    var stringerino = request.body.checkin;
    var database = client.db('cmpt218_jpa87');
    var collection = database.collection('users');
    var array = collection.find({checkString: stringerino}).toArray();
    array.then(function(results){
      console.log(results);
      response.json(results);
    }).catch(function(err){
      response.status('404');
      response.send("Theres nothing for that check in id");
    });

  });
});

//stopping check-in and creating new table
app.post('/stop-check-in',function(request, response){
  if(checkInObject.check == true){
    mongo.connect(url, function(err, client){
      if(err) console.log(err);
      console.log('connected');
      var currentDate = checkInObject.date
      var database = client.db('cmpt218_jpa87');
      var collection = database.collection('users');
      var array = collection.find({date: {$gte: currentDate}}).toArray();
      array.then(function(results){
        var html = dynamicHTMLStopCheck(attendeeNumber, results);
        response.status('200');
        response.send(html);
      }).catch(err => console.log(err));
    });
  }
});

//Managing delete request on certain documents
app.delete('/delete/:id', function(request, response){
  mongo.connect(url, function(err, client){
    if(err) console.log(err);
    console.log('connected');
    var currentDate = checkInObject.date
    var database = client.db('cmpt218_jpa87');
    var collection = database.collection('users');
    var array = collection.deleteOne({$and: [{checkString: request.body.checkString}, {name: request.body.name}, {studentid: request.body.studentid}, {date: request.body.date}]}, function(err, obj){
      if(err) console.log(err);
      console.log("Document deleted");
    });
    var arrayNew = collection.find({checkString: request.body.checkString}).toArray();
    arrayNew.then(function(results){
      response.json(results);
    }).catch(err => console.log(err));
  });
});

http.createServer(app).listen(16976);
console.log('running on port 16976');
