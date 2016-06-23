tabris.ui.set("toolbarVisible", false);
var MARGIN = 20;
var logo;

var page = new tabris.Page({
  title: 'Coposition',
  style: ["FULLSCREEN"],
  topLevel: true
}).once('resize', function () {
  logo = new tabris.ImageView({
    layoutData: {
      top: MARGIN,
      width: percentOfSmallest(25, 300),
      centerX: 0
    },
    image: './images/logo.png',
  }).appendTo(page);
})

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

function percentOfSmallest (percentage, imageSize) {
  var bounds = page.get('bounds');
  var smallest = bounds.height > bounds.width ? bounds.width : bounds.height;
  var computed = smallest / 100 * percentage;
  if(computed < imageSize) {
    return ~~computed
  }
  return imageSize;
}

startButton.on('select', function() {
  textView.set('text', getCoord());
});

function getCoords () {
  window.plugins.GPSLocator.getLocation(function(result) {
    return JSON.stringify(result); //result[0]:latitude,result[1]:longitude.
  }, function(e) {
    return JSON.stringify(e); //Error Message
  });
}

page.open();
