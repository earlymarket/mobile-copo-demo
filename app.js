tabris.ui.set("toolbarVisible", false);
var MARGIN = 20;
var HARDCODED_UUID = '94f62baa-4b6d-437e-9f2c-1537bcedb02a';
var timerId;

var page = new tabris.Page({
  title: 'Coposition',
  style: ["FULLSCREEN"],
  topLevel: true
}).on('resize', function () {
  logo.set('width', percentOfSmallest(25, 300));
})

var logo = new tabris.ImageView({
  layoutData: {
    top: MARGIN,
    width: percentOfSmallest(25, 300),
    centerX: 0
  },
  image: './images/logo.png',
}).appendTo(page);

var startButton = new tabris.Button({
  centerY: -24,
  left: MARGIN,
  right: MARGIN,
  background: '#FF7E00',
  textColor: '#FFF',
  font: '24px',
  text: 'START'
}).appendTo(page);

var textView = new tabris.TextView({
  centerX: 0, top: [startButton, 50],
  font: '24px'
}).appendTo(page);

function percentOfSmallest(percentage, imageSize) {
  var bounds = page.get('bounds');
  var smallest = bounds.height > bounds.width ? bounds.width : bounds.height;
  var computed = smallest / 100 * percentage;
  if(computed < imageSize) {
    return ~~computed
  }
  return imageSize;
}

function getCoords() {
  plugins.GPSLocator.getLocation(function(result) {
    return result;
  }, function(e) {
    console.log(JSON.stringify(e));
  });
}

var copoHeader = new Headers({
  'X-API-Key': 'd9b266cb-7fd6-420b-91e9-921bd8a5b53d',
  'cache-control': 'no-cache',
  'content-type': 'application/json'
});

var uuidInit = {
  method: 'GET',
  headers: copoHeader,
  mode: 'cors'
};

var uuidRequest = new Request('https://api.coposition.com/v1/uuid', uuidInit);

function getUUID() {
  fetch(uuidRequest, uuidInit)
  .then(function (response) {
    textView.set('text', JSON.stringify(response.json()));
  });
}

function startTimer(seconds) {
  timerId = setInterval(function () {
    checkin();
  }, 1000 * seconds)
};

var checkinHeader = new Headers({
  'X-API-Key': 'd9b266cb-7fd6-420b-91e9-921bd8a5b53d',
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  'X-UUID': HARDCODED_UUID
})

var checkinInit = {
  method: 'POST',
  headers: checkinHeader,
  mode: 'cors',
  body: {
    lat: getCoords()[0],
    lng: getCoords()[1]
  }
}

var checkinRequest = new Request('https://api.coposition.com/v1/checkins', checkinInit);

function checkin() {
  console.log('Checking in now! ' + Date.now());
  fetch(checkinRequest.clone, checkinInit)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(JSON.stringify(data));
  });
}

startButton.on('select', function () {
  if(startButton.get('text') === 'START') {
    startButton.set('text', 'STOP');
    console.log('Starting to check-in now.')
    checkin();
    startTimer(10);
  } else {
    startButton.set('text', 'START');
    console.log('Stopping check-in\'s now');
    clearInterval(timerId);
  }
});

page.open();
