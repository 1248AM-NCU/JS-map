//Obtain user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((e) => {
            console.log(e)
            let coords = e.coords
            var map = L.map('map').setView([coords.latitude, coords.longitude], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            L.marker([coords.latitude, coords.longitude], {title:"You are here"}).bindTooltip("You are here").addTo(map).openTooltip();
        });


    } else {
        alert("oi")
    }
}

getLocation()


//Load map

//Get location selection filter
//Display text information as well