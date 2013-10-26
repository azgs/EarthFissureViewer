var app = {
  map: L.map('map', {center: [32.5, -111.5], zoom: 8}),
  layers: {
	  baseLayer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms & Feedback</a>'
	  }),
	  fissuresLayer: L.tileLayer('http://localhost:3000/{z}/{x}/{y}.png'),
	  studyAreas: L.geoJson(studyareas, {
	  	style: {
	  		'color': '#0000FF',
	  		'weight': 2,
	  		'fillOpacity': 0
	  	}
	  }).on('click', doClick)  	
  }
};

var template = '<div class=row>' +
                	'<div class=col-md-12>A</div>' +
            	'</div>' +
            	'<div class=row>' +
	                '<div class=col-md-8>B</div>' +
	                '<div class=col-md-4>C' +
	                '<div class=row>' +
                    	'<div class=col-md-4>D</div>' +
                    '</div>' +
                '</div>' 

function doClick(e) {
	//var template = $('#popup-template').html();
	//$('.leaflet-popup-content').html(_.template(template));
	L.popup()
		.setLatLng(e.latlng)
		.setContent(template)
		.openOn(app.map);
}

for (var key in app.layers) {
	app.layers[key].addTo(app.map);
}

// Add click effect to the legend toggler
d3.select('#toggle-info').on('click', function () {
  var enabled = d3.select('#info').classed('hidden');
  d3.select('#info').classed('hidden', !enabled);
});

