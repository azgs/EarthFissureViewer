var app = {
  map: L.map('map', {center: [32.3, -111], zoom: 8}),
  layers: {
	  baseLayer: L.tileLayer('http://a.tiles.mapbox.com/v3/azgs.map-qc1pcpws/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms & Feedback</a>'
	  }),
	  fissuresLayer: L.tileLayer('http://{s}.tiles.usgin.org/fissures/{z}/{x}/{y}.png'),
	  studyAreas: L.geoJson(null, {
	  	style: {
	  		'color': 'rgb(54,204,255)',
	  		'weight': 4,
	  		'fillOpacity': 0
	  	},
	  	onEachFeature: onEachFeature
	  })  	
  }
}; 

function onEachFeature(feature, layer) {
	var pdf = feature.properties.Pdf.split(','),
	    label = feature.properties.Label,
			bbox = layer.getBounds().toBBoxString(),

			preview = _.chain(pdf)
				.map(function (item) { return 'assets/' + item + '.png'; })
				.last()
				.value(),

			links = _.map(pdf, function (item) {
				var path = '/assets/' + item + '.pdf';
				return '<div class="alert alert-info"><a href="' + path + '">' + item + '</a></div>';
			}).join('');

	var html = '<div class=title><h4>' + label + ' Study Area</h4></div>';
		 html += '<div class=content>';
		 html += '<div class=preview><img src=' + preview + '></div>';
		 html += '<div class=links><h5>Downloadable Maps:</h5>';
		 html += '<div class=download>' + links + '</div>';
		 html += '<div id=zoom>';
		 html += '<button type="button" onclick="doZoom(' + bbox + ')" class="btn btn-success">Zoom to this study area</button>';
		 html += '</div></div></div>';
	
	var popup = L.popup({
		'maxWidth': 500,
		'minWidth': 250
	}).setContent(html);

	layer.bindPopup(popup);
}

var doZoom = function (bbox0, bbox1, bbox2, bbox3) {
	var bounds = L.latLngBounds([[bbox1, bbox0], [bbox3, bbox2]]);
	app.map.fitBounds(bounds);
}

app.layers.baseLayer.addTo(app.map);
app.layers.fissuresLayer.addTo(app.map);
app.layers.studyAreas.addTo(app.map);
L.geocoderControl().addTo(app.map);

d3.json('data/studyareas.json', function (err, data) {
	if (err) return console.log(err);
	app.layers.studyAreas.addData(data);
});

d3.select('#toggle-info').on('click', function () {
  var enabled = d3.select('#info').classed('hidden');
  d3.select('#info').classed('hidden', !enabled);
});

