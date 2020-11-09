const latSearch = document.getElementById("latSearch")
const lonSearch = document.getElementById("lonSearch")
let currentLat = 0;
let currentLon = 0;

latSearch.addEventListener("keyup", e => {
    console.log(e.target.value !== "")
    if (e.target.value !== "" && e.key.includes("Arrow") === false && lonSearch.value !== "") {
        debounceSearchWeather("latSearch", {coordinates: [latSearch.value, lonSearch.value]})
    }
});

lonSearch.addEventListener("keyup", e => {
    console.log(e.target.value !== "")
    if (e.target.value !== "" && e.key.includes("Arrow") === false  && latSearch.value !== "") {
        debounceSearchWeather("lonSearch", {coordinates: [latSearch.value, lonSearch.value]})
    }
});

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            console.log(position)
            latSearch.value = position.coords.latitude
            lonSearch.value = position.coords.longitude
            debounceSearchWeather("lonSearch", {coordinates: [latSearch.value, lonSearch.value]})
        });
    }
});

