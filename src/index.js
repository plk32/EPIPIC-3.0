const AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB();
var id = 0;

exports.lambda_handler = function(event, context, callback) {

  switch (event.httpMethod) {
    case 'POST':
      postFunction(event, context, callback);
      break;
    case 'GET':
      getFunction(event, context, callback);
      break;
  }

};

const getFunction = function (event, context, callback) {
  var response = {
     statusCode: 200,
     headers: {
       "Access-Control-Allow-Headers": "*",
       "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
       "Access-Control-Allow-Origin": "*"
     },
     body: JSON.stringify(event)
  };
  callback(null, response);
};

const postFunction = function (event, context, callback) {

  var jsonObject = JSON.parse(Buffer.from(event['body'], 'base64').toString());

  if (!jsonObject || !jsonObject.picture || !jsonObject.caption) {
    var error = {
      statusCode: 512,
      body: JSON.stringify("No picture or caption added")
    };
    callback(null, error);
  }

  var response = null;
  id += 1;

  var params = {
    TableName : process.env.TABLE_NAME,
    Item: {
      "id": {
        S: id.toString()
      },
      "picture": {
        S: jsonObject.picture
      },
      "caption": {
        S: jsonObject.caption
      }
    },
    ReturnConsumedCapacity: "TOTAL"
  };

  dynamodb.putItem(params, function(err, data) {
    if (err)
      response = {
        statusCode: 500,
        body: err.message
      };
    else
      response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
          "Access-Control-Allow-Origin": "*"
        },
        body: "Element ajouté !"
      };
    callback(null, response);
  });
};
/*
// Root sends index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/api/pictures', (req, res) => {
  //let myImages = fs.readFileSync('./api/1500-random-images.json');
  let myImages = fs.readFileSync('./api/myimages.json');
  let pictures = JSON.parse(myImages);

  let array = [];
  let cursor = -1;
  if (req.query.cursor != undefined) {
    cursor = parseInt(req.query.cursor);
  }
  let max = cursor + parseInt(req.query.amount);
  console.log('cursor: ' + cursor);

  if (cursor > pictures.length - 1) {
    return res.sendStatus(404);
  }

  for(let i = cursor + 1; (i <= max) && (i < pictures.length); i++) {
    let obj = {}
    obj.id = pictures[i].id;
    obj.index = pictures[i].index;
    obj.picture = pictures[i].picture;
    obj.caption = pictures[i].caption;

    //console.log(JSON.stringify(obj));
    array.push(obj);
  }
  res.send({ 'pictures' : array });
});

app.post('/api/pictures', (req, res) => {
  if (req.body.picture == null) {
    return res.sendStatus(500);
  }

  let myImages = fs.readFileSync('./api/myimages.json');
  let pictures = JSON.parse(myImages);

  let obj = {}
  obj.id = pictures[pictures.length - 1].id + 1;
  obj.index = pictures.length;
  obj.picture = req.body.picture;
  obj.caption = req.body.caption;

  pictures.push(obj);
  let picturesNew = JSON.stringify(pictures);
  fs.writeFileSync('./api/myimages.json', picturesNew);

  res.send('Picture posted');
  console.log(obj);
});

app.delete('/api/pictures/:id', (req, res) => {
  let myImages = fs.readFileSync('./api/myimages.json');
  let pictures = JSON.parse(myImages);

  for (let i = 0; i < pictures.length; i++) {
    if (pictures[i].id == req.params.id) {
      pictures.splice(i, 1);
    }
  }

  let picturesNew = JSON.stringify(pictures);
  fs.writeFileSync('./api/myimages.json', picturesNew);
  res.send('DELETE request for id: ' + req.params.id);
});

// start your server
app.listen(4242, () => {
  console.log('EPIPIC listening on port 4242!');
});
*/
//module.exports = app;
