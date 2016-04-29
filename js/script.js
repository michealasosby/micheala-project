//Roughly the center of Missouri(lat/long)
var center = [38.6321346, -92.4013551]

//Target the chart div as the container for our leaflet map
//Set the center point and zoom level.
var map = L.map('chart').setView(center, 7);

// add an OpenStreetMap tile layer
//OpenStreetMap is an open source map layers anyone can use free of charge.
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// //Add an svg element to the map.
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

//This will be a dictionary object we use to lookup the info for each county.
//It's empty for now. We add our data when we load or json.
var theData = {};

// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}

//http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2
d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};
d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

var allZipCodes = {};
var ourZipsArray = [];

$(document).ready(function(d) {

  d3.csv("data/missouri-guns.csv", function(data) {
    for (i=0; i<data.length; i++) {
        if (!allZipCodes[data[i].zipcode]) {
          allZipCodes[data[i].zipcode] = 0;
          allZipCodes[data[i].zipcode] +=1;
        }
      }

      $.each(allZipCodes, function(zipcode, licenses) {
        var zipcode = String(zipcode);
        var zipcode = zipcode.substring(0,5);
        var obj = {
          zipcode : zipcode,
          licenses : licenses
        }

        theData[zipcode] = obj;
        theData[licenses] = obj;

        ourZipsArray.push(obj);
        console.log(ourZipsArray);
      });

  })

  drawMap();
  })


function drawMap() {

  d3.json("js/missouri-zips.json", function(collection) {
    var transform = d3.geo.transform({
      point: projectPoint
    }),
    path = d3.geo.path().projection(transform);

    var feature = g.selectAll("path")
      .data(collection.features)
      .enter()
      .append("path")
      .attr("class", "zipcode");

console.log(feature);



  })
}
