const zipSearch = document.getElementById("zipSearch")

zipSearch.addEventListener("keyup", e => {
    console.log(e.target.value !== "")
    if (e.target.value !== "" && e.key.includes("Arrow") === false) {
        debounceSearchWeather("zipSearch", {zip: e.target.value})
    }
});

$(".ui.dropdown").dropdown()
generateDropdown("zipHistory")