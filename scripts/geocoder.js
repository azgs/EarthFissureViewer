/* 

Code derived from MapBox.js https://github.com/mapbox/mapbox.js/tree/v1/src
Adjustments by Ryan Clark for the Arizona Geological Survey

# MapBox.js

Copyright (c), MapBox  
All rights reserved.

Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this
  list of conditions and the following disclaimer in the documentation and/or
  other materials provided with the distribution.
- Neither the name "MapBox" nor the names of its contributors may be
  used to endorse or promote products derived from this software without
  specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

// This one is for OSM nominatim. bboxes kinda suck
var geocoder = {
    query: function (searchString, callback) {
        var url = 'http://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(searchString) + '&format=json';
        d3.json(url, function (err, json) {
            if (json && json.length) {
                var res = {
                    results: json,
                    latlng: [json[0].lat, json[0].lon]
                };
                if (json[0].boundingbox !== undefined) {
                    res.bounds = json[0].boundingbox;
                    res.lbounds = new L.LatLngBounds([[res.bounds[0], res.bounds[2]], [res.bounds[1], res.bounds[3]]]);
                }
                callback(null, res);
            } else callback(err || true);
        });
    }
};

/* Don't try Google. This is illegal
var googGeocoder = {
    query: function (searchString, callback) {
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=' + encodeURIComponent(searchString);
        d3.json(url, function (err, json) {
            if (json && json.results && json.results.length) {
                var res = {
                    results: json.results.map(function (result) {
                        return {
                            display_name: result.formatted_address,
                            boundingbox: [
                                result.geometry.viewport.southwest.lat,
                                result.geometry.viewport.northeast.lat,
                                result.geometry.viewport.southwest.lng,
                                result.geometry.viewport.northeast.lng
                            ]
                        }
                    })
                };
                callback(null, res);
            } else callback(err || true);
        });
    }
};
*/

var GeocoderControl = L.Control.extend({
    includes: L.Mixin.Events,

    options: {
        position: 'topleft',
        keepOpen: false
    },

    initialize: function(options) {
        L.Util.setOptions(this, options);
        this.geocoder = geocoder;
    },

    _toggle: function(e) {
        if (e) L.DomEvent.stop(e);
        if (L.DomUtil.hasClass(this._container, 'active')) {
            L.DomUtil.removeClass(this._container, 'active');
            this._results.innerHTML = '';
            this._input.blur();
        } else {
            L.DomUtil.addClass(this._container, 'active');
            this._input.focus();
            this._input.select();
        }
    },

    _closeIfOpen: function(e) {
        if (L.DomUtil.hasClass(this._container, 'active') &&
            !this.options.keepOpen) {
            L.DomUtil.removeClass(this._container, 'active');
            this._results.innerHTML = '';
            this._input.blur();
        }
    },

    onAdd: function(map) {

        var container = L.DomUtil.create('div', 'leaflet-control-mapbox-geocoder leaflet-bar leaflet-control'),
            link = L.DomUtil.create('a', 'leaflet-control-mapbox-geocoder-toggle mapbox-icon mapbox-icon-geocoder', container),
            results = L.DomUtil.create('div', 'leaflet-control-mapbox-geocoder-results', container),
            wrap = L.DomUtil.create('div', 'leaflet-control-mapbox-geocoder-wrap', container),
            form = L.DomUtil.create('form', 'leaflet-control-mapbox-geocoder-form', wrap),
            input  = L.DomUtil.create('input', '', form);

        link.href = '#';
        link.innerHTML = '&nbsp;';

        input.type = 'text';
        input.setAttribute('placeholder', 'Search');

        L.DomEvent.addListener(form, 'submit', this._geocode, this);
        L.DomEvent.disableClickPropagation(container);

        this._map = map;
        this._results = results;
        this._input = input;
        this._form = form;

        if (this.options.keepOpen) {
            L.DomUtil.addClass(container, 'active');
        } else {
            this._map.on('click', this._closeIfOpen, this);
            L.DomEvent.addListener(link, 'click', this._toggle, this);
        }

        return container;
    },

    _geocode: function(e) {
        L.DomEvent.preventDefault(e);
        L.DomUtil.addClass(this._container, 'searching');

        var map = this._map;
        var onload = L.bind(function(err, resp) {
            L.DomUtil.removeClass(this._container, 'searching');
            if (err || !resp || !resp.results || !resp.results.length) {
                this.fire('error', {error: err});
            } else {
                this._results.innerHTML = '';
                if (resp.results.length === 1 && resp.lbounds) {
                    this._map.fitBounds(resp.lbounds);
                    this._closeIfOpen();
                } else {
                    for (var i = 0, l = Math.min(resp.results.length, 5); i < l; i++) {
                        var name = [];
                        if (resp.results[i].display_name) name.push(resp.results[i].display_name);
                        if (!name.length) continue;

                        var r = L.DomUtil.create('a', '', this._results);
                        r.innerHTML = name.join(', ');
                        r.href = '#';

                        (function(result) {
                            L.DomEvent.addListener(r, 'click', function(e) {
                                var _ = result.boundingbox;
                                map.fitBounds(L.latLngBounds([[_[0], _[2]], [_[1], _[3]]]));
                                //map.panTo(L.latLng(resp.latlng));
                                L.DomEvent.stop(e);
                            });
                        })(resp.results[i]);
                    }
                    if (resp.results.length > 5) {
                        var outof = L.DomUtil.create('span', '', this._results);
                        outof.innerHTML = 'Top 5 of ' + resp.results.length + '  results';
                    }
                }
                this.fire('found', resp);
            }
        }, this);

        this.geocoder.query(this._input.value, onload);
    }
});

L.geocoderControl = function(options) {
    return new GeocoderControl(options);
};