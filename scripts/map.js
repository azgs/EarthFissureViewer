var app = {
  map: L.map('map', {center: [32.5, -111.5], zoom: 8}),
  layers: {
	  baseLayer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	    attribution: '<a href="https://www.mapbox.com/about/maps/">Terms & Feedback</a>'
	  }),
	  fissuresLayer: L.tileLayer('http://localhost:3000/{z}/{x}/{y}.png'),
	  studyAreas: L.geoJson(studyareas, {
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
	var pdf = feature.properties.Pdf;
	var label = feature.properties.Label;

	var template = function(title, preview, links) {
		this.template = '<div class=title><h4>' + title + ' Study Area</h4></div>' +
						'<div class=content>' +
							'<div class=preview><img src=' + preview + '></div>' +
							'<div class=links><h6>Downloadable Maps:</h6>' + 
								'<div class=download>' + links + '</div>' +
							'</div>' +
						'</div>'
		return this.template;
	}

	var preview = function() {
		this.path;
		_.each(pdf, function(item){
			this.path = 'assets/' + item + '.png';
		});
		return this.path;
	}

	var download_path = function(item) {
		base_uri = document.baseURI.toString();
		whole_uri = base_uri.substring(0, base_uri.lastIndexOf("/") + 1);
		return whole_uri + item + '.pdf'
	}

	var links = function() {
		this.html;
		var template = _.template('<ul><a href= <%= path %>> <%= name %></a></ul>');
		_.each(pdf, function(item) {
			path = download_path(item);
			if (pdf.length > 1) {
				this.html += template({path: path, name: item});
			} else {
				this.html = template({path: path, name: item});
			}
		});
		return this.html;
	}

	var popupTemplate = template(label, preview(), links());

	var popup = L.popup({
		'maxWidth': 500,
		'minWidth': 250
	}).setContent(popupTemplate);

	layer.bindPopup(popup);
}

for (var key in app.layers) {
	app.layers[key].addTo(app.map);
}

L.geocoderControl().addTo(app.map);

d3.select('#toggle-info').on('click', function () {
  var enabled = d3.select('#info').classed('hidden');
  d3.select('#info').classed('hidden', !enabled);
});

