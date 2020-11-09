const citySearch = document.getElementById("citySearch")

citySearch.addEventListener("keyup", e => {
    if (e.target.value !== "" && e.key.includes("Arrow") === false) {
        debounceSearchWeather("citySearch", {city: e.target.value})
    }
});

$(".ui.dropdown").dropdown()
generateDropdown("cityHistory")