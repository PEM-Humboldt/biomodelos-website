var _BioModelosVisorModule = function() {
	var map;

	var init = function(){
		var latlng = new L.LatLng(4, -72),
        zoom = 6,
        mZoom = 2,
        mxZoom = 16;
        console.log("Entre");
		map = L.map('map', {crs: L.CRS.EPSG4326}).setView(latlng, zoom);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);
	}
	
	return{
		init:init
	}
}();

$(document).ready(function() {
	_BioModelosVisorModule.init();
});