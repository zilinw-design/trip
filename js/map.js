window.map=L.map('map').setView([28.2282,112.9388],13);
L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?style=7&x={x}&y={y}&z={z}',{subdomains:['1','2','3','4']}).addTo(map);
window.addPlaceMarker=function(p){
L.marker([p.lat,p.lng]).addTo(map).bindPopup('<b>'+p.name+'</b><br>'+ (p.address||''));
}