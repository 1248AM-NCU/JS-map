//Obtain user location
let coords;
let destination;
let map;
const typeIds ={
    cafe: 13032,
    restaurant: 13065,
    hotel: 19014,
    market: 17114
}
const k = "fsq351qgi6/IEjxCCbINDNva3cCiqGVaaY+DNEzq1dF+YEw="
const select = document.getElementById("select-type")
let resultMarkers = []
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((e) => {
            coords = e.coords
            map = L.map('map').setView([coords.latitude, coords.longitude], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
            let self = L.marker([coords.latitude, coords.longitude], {title:"You are here"})
            self.bindTooltip("You are here")
            self.addTo(map)
            self.openTooltip();
            let range = L.circle([coords.latitude, coords.longitude], {radius: 16000, title: "range"});
            range.addTo(map);
        });
    } else {
        alert("oi i need your location")
    }
}
async function getLocations(type){
    let req = await fetch(`https://api.foursquare.com/v3/places/search?categories=${typeIds[type]}&radius=16000&ll=${coords.latitude},${coords.longitude}&limit=10`,{
        headers: {
            Accept: "application/json",
            Authorization: k
        }
    })
    let res = await req.json()
    res.results.forEach(e => {
        let self = L.marker([e.geocodes.main.latitude, e.geocodes.main.longitude], {title:e.name})
        self.bindTooltip(e.name)
        self.addTo(map)
        self.openTooltip()
    });
}

//Opens a window with directions from user location to destination using Google maps
function getDirections(to, from){
    window.open(`https://www.google.com/maps/dir/${from.latitude},${from.longitude}/${to.latitude},${to.longitude}`)
}
function changedType(){
    getLocations(select.value)
}

function showGoTo(name){

}
function HideGoTo(){

}
initMap()