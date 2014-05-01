var app = {
  map: L.map('map', {center: [32.3, -111], zoom: 8, minZoom: 8, maxZoom:14}),
  layers: {
	  baseLayer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { // 'http://a.tiles.mapbox.com/v3/azgs.map-qc1pcpws/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms & Feedback</a>',
	    detectRetina: true
	  }),
	  fissuresLayer: L.tileLayer('http://{s}.tiles.usgin.org/fissures/{z}/{x}/{y}.png'),
	  studyAreas: L.geoJson(null, {
	  	style: {
	  		'color': 'rgb(54,204,255)',
	  		'weight': 4,
	  		'fillOpacity': 0
	  	},
	  	onEachFeature: onEachFeature
	  }),
/*
	  photoAreas: L.geoJson(null, {
	  	onEachFeature: photographize
	  })
*/
  },
  imgHeights: {
  	'luke': 188,
	  'picacho-3': 204,
	  'harquahala': 210,
	  'greene-wash': 240,
	  'white-horse-pass': 247,
	  'santa-rosa-wash': 119,
	  'toltec-buttes': 206,
	  'scottsdale': 143,
	  'apache-junction': 238,
	  'chandler-heights': 139,
	  'petes-corner': 211,
	  'wintersburg': 231,
	  'heaton': 116,
	  'tator-hills': 108,
	  'signal-peak': 217,
	  'friendly-corner': 217,
	  'sacaton-butte': 245,
	  'three-sisters-butte': 225,
	  'dragoon-road': 234,
	  'mesa': 135,
	  'croton-springs': 226,
	  'elfrida': 226,
	  'bowie-san-simon': 210
  }
};

function onEachFeature(feature, layer) {
	var pdf = feature.properties.Pdf.split(','),
	    label = feature.properties.Label,
		bbox = layer.getBounds().toBBoxString(),

		lastOne = pdf[pdf.length - 1],
		preview = 'assets/' + lastOne + '.png',

		links = _.map(pdf, function (item) {
			var path = 'assets/' + item + '.pdf';
			return '<div class="alert alert-info"><a href="' + path + '">' + item + '</a></div>';
		}).join('');

		urlCheck = function(url) {
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
			if (http.status === 200) {
				return links;
			} else {
				return '<div class="alert alert-danger">Not Available</div>';
			}
		}

	var html = '<div class="title"><h4>' + label + ' Study Area</h4></div>';
		html += '<table><tr>';
		html += '<td style="width:250px;height:' + app.imgHeights[lastOne] + 'px;"><img src="' + preview + '" onerror=this.style.display="none"; /></td>';
		html += '<td style="padding-left:10px;">';
		html += '<h5>Downloadable Maps:</h5>';
		html += '<div class=download>' + urlCheck(preview) + '</div>';
		html += '<button type="button" onclick="doZoom(' + bbox + ')" class="btn btn-success">Zoom to this study area</button>';
		html += '</td></tr></table>';

	layer.bindPopup(html, { minWidth: 430 });
}
/*
function photographize(feature, layer) {
	var center = layer.getBounds().getCenter(),
		label = feature.properties.Name,
		jpg = feature.properties.PhotoIDs.split(','),
		icon = L.divIcon({className: 'glyphicon glyphicon-camera'}),
		photo = L.marker(center, {icon: icon}).addTo(app.map);

	var indicators = _.map(jpg, function (photo, i) {
		if (i === 0) {
			return '<li data-target="#photo-slide-show" data-slide-to=' + i + ' class="active"></li>';
		} else {
			return '<li data-target="#photo-slide-show" data-slide-to=' + i + '></li>';
		}
	}).join('');

	var links = _.map(jpg, function (photo, i) {
		var path = 'assets/resized_field_photos/' + photo + '.jpg';
		if (i === 0) {
			return '<div class="item active" style="display:block;margin-left:auto;margin-right:auto;"><img src=' + path + '/></div>';
		} else {
			return '<div class="item" style="display:block;margin-left:auto;margin-right:auto;"><img src=' + path + '/></div>';
		}
	}).join('');

	var html = '<div class="title"><h4>' + label + ' Field Photography</h4></div>';
		html += '<div id="photo-slide-show" class="carousel slide" data-ride="carousel">';
		html += '<ol class="carousel-indicators">' + indicators + '</ol>';
		html += '<div class="carousel-inner" style="height:400px;">' + links+ '</div>';
		html += '<div class="custom-color">';
		html += '<a class="left carousel-control" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>';
		html += '<a class="right carousel-control" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>';
		html += '</div></div>';

	photo.bindPopup(html, { minWidth: 400 });

	$('.item').first().addClass('active');
}
*/
var doZoom = function (bbox0, bbox1, bbox2, bbox3) {
	var bounds = L.latLngBounds([[bbox1, bbox0], [bbox3, bbox2]]);
	app.map.fitBounds(bounds);
}

app.layers.baseLayer.addTo(app.map);
app.layers.fissuresLayer.addTo(app.map);
app.layers.studyAreas.addTo(app.map);
L.geocoderControl().addTo(app.map);

d3.json('data/earth_fissure_study_areas.json', function (err, data) {
	if (err) return console.log(err);
	app.layers.studyAreas.addData(data);
});

d3.json('data/earth_fissure_photo_areas.json', function (err, data) {
	if (err) return console.log(err);
	app.layers.photoAreas.addData(data);
})

// Add click effect to the legend toggler
d3.select('#toggle-info').on('click', function () {
  var enabled = d3.select('#info').classed('hidden');
  d3.select('#info').classed('hidden', !enabled);
});