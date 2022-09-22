//Obtain user location
let coords;
let destination;
let map;
//Type ID's for FSQR. I could not find how to get these programmatically through their API, if even possible
const typeIds ={
    cafe: 13032,
    restaurant: 13065,
    hotel: 19014,
    market: 17114
}
const k = "fsq351qgi6/IEjxCCbINDNva3cCiqGVaaY+DNEzq1dF+YEw="
//Type of business selection
const select = document.getElementById("select-type")
//Box that contains the information of the selected place and button for getting directions
const infoBox = 
{
    container:document.getElementById("info"),
    name: document.getElementById("name"),
    addr: document.getElementById("addr"),
    distance: document.getElementById("distance"),
    button: document.getElementById("get-dir"),
    //Takes the FSQR object and updates the info box accordingly
    updateInfo(loc){
         this.name.textContent = loc.name
         this.addr.textContent = loc.location.address
         this.distance.textContent = (loc.distance / 1000).toString().split(".")[0] + " km away"
         this.button.onclick = 
         () => getDirections([loc.geocodes.main.latitude, loc.geocodes.main.longitude], [coords.latitude, coords.longitude])
         this.container.style.display = "block"
    }
}
//Location results
let locations = []
//Markers of each location using Leaflet
let resultMarkers = []
//Initiallizes the map
function initMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((e) => {
            coords = e.coords
            map = L.map('map').setView([coords.latitude, coords.longitude], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);
            let self = L.marker([coords.latitude, coords.longitude], {title:"You are here", draggable:true})
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
//Function that gets locations return by FSQR
async function getLocations(type){
    //document.getElementById("map").classList.add("anim-map") Dont work yet
    let req = await fetch(`https://api.foursquare.com/v3/places/search?categories=${typeIds[type]}&radius=16000&ll=${coords.latitude},${coords.longitude}&limit=10`,{
        headers: {
            Accept: "application/json",
            Authorization: k
        }
    })
    infoBox.container.style.display = "none"
    //Clear markers
    resultMarkers.forEach(e => map.removeLayer(e))
    resultMarkers = []
    //Add in new markers : ADD ERROR HANDLING
    let res = await req.json()
    locations = res.results
    locations.forEach(e => {
        //Create marker
        let self = L.marker([e.geocodes.main.latitude, e.geocodes.main.longitude], {title:e.name})
        //Add tooltip
        self.bindTooltip(`<spanc class="tt-style">${e.name}</span>`, { permanent:true})
        self.addTo(map)
        self.openTooltip()
        //Show location data on click event
        self.location = e
        self.on('click', () => {infoBox.updateInfo(self.location)})
        resultMarkers.push(self)
    });
}

//Opens a window with directions from user location to destination using Google maps
function getDirections(to, from){
    window.open(`https://www.google.com/maps/dir/${from[0]},${from[1]}/${to[0]},${to[1]}`)
}
//Called by the selection box onChange
function changedType(){
    getLocations(select.value)
}
initMap()