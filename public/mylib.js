const endpoint = 'https://d761zmwq6c.execute-api.eu-west-2.amazonaws.com/dev';

function getFirstPictures(amount) {
  const req = new XMLHttpRequest();
  req.open('GET', endpoint + '/pictures?&amount=' + amount , false);
  req.send(null);
  var pictures = JSON.parse(req.responseText);
  showPictures(pictures);
}

function getPictures(cursor, amount) {
  const req = new XMLHttpRequest();
  req.open('GET', endpoint + '/pictures?cursor=' + cursor + "&amount=" + amount , false);
  req.send(null);
  if (req.status !== 404) {
    var pictures = JSON.parse(req.responseText);
    showPictures(pictures);
  }
}

function showPictures(pictures) {
  var grid = document.querySelector('.grid');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < pictures.length; i++) {
    var cell = document.createElement('div');
    cell.setAttribute('class', 'cell');

    // Image with attributes
    var img = document.createElement('img');
    img.setAttribute('src', pictures[i].picture);
    img.setAttribute('alt', pictures[i].caption);
    img.setAttribute('width', 200);
    img.setAttribute('height', 200);

    // Button for delete
    var btn = document.createElement('button');
    btn.innerHTML = 'X';
    btn.setAttribute('class', 'btn-delete');
    btn.onclick = function() {
      const req = new XMLHttpRequest();
      cell.parentNode.removeChild(cell);
      req.open('DELETE', endpoint + '/pictures/' + pictures[i].id, false);
      req.send(null);
    };

    // Construct DOM
    cell.appendChild(img);
    cell.appendChild(btn);
    fragment.appendChild(cell);
  }

  grid.appendChild(fragment);
}

/*function sendPicture() {
  var data = {
    'picture' : document.getElementById('picture').value,
    'caption' : document.getElementById('caption').value
  }
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("POST", "/api/pictures", true);
  xmlhttp.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  xmlhttp.send(JSON.stringify(data));
};*/
