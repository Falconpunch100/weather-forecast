let debounceSearchWeather = _.debounce(searchWeather, 750);
const apiKey = "02e4e9d25f2d235d85bff5366a7eba71"
const baseURL = "https://api.openweathermap.org/data/2.5/weather"
const iconURL = "http://openweathermap.org/img/wn/"
const weeklyForecastURL = "https://api.openweathermap.org/data/2.5/onecall"
//This is a default argument. If nobody passes anything, they will automatically give this.
async function searchWeather(searchType = "citySearch", infoObject) {
    let response
    if (searchType === "citySearch") {
        response = await axios.get(baseURL, {
            params: {
                q: infoObject.city,
                appid: apiKey,
                units: document.querySelector("input[type=radio]:checked").value,
            }
        });
        citySearchHistory(infoObject.city)
    }
    else if (searchType === "zipSearch") {
        response = await axios.get(baseURL, {
            params: {
                zip: infoObject.zip,
                appid: apiKey,
                units: document.querySelector("input[type=radio]:checked").value,
            }
        });
        zipSearchHistory(infoObject.zip)
    }
    else {
        response = await axios.get(baseURL, {
            params: {
                lat: infoObject.coordinates[0],
                lon: infoObject.coordinates[1],
                appid: apiKey,
                units: document.querySelector("input[type=radio]:checked").value,
            }
        });
        coordSearchHistory(infoObject.coordinates)
    }
    renderWeather(response.data)
    sevenDays(response.data.coord)
}

function renderWeather(weatherObj) {
    const container = document.getElementById("forecast")
    container.innerHTML = `<div class="ui large header">${weatherObj.name}</div>
    <img src="${iconURL}${weatherObj.weather[0].icon}@2x.png" />
    <h3 id="description">${weatherObj.weather[0].description}</h3>
    <h4>Temperature:</h2>
    <p>min: ${weatherObj.main.temp_min} max: ${weatherObj.main.temp_max} current: ${weatherObj.main.temp}<br></p>
    <p>wind: ${weatherObj.wind.speed} mph</p>
    <p>humidity: ${weatherObj.main.humidity}%</p>`
}

async function sevenDays(coord) {
    let response = await axios.get(weeklyForecastURL, {
        params: {
            lat: coord.lat,
            lon: coord.lon,
            appid: apiKey,
            units: document.querySelector("input[type=radio]:checked").value,
            exclude: "current,minutely,hourly,alert"
        }
    });
    let weeklyForecast = response.data.daily;
    weeklyForecast.shift()
    displayWeeklyForecast(weeklyForecast)
}

function convertLinuxTime(linux) {
    let date = new Date(linux * 1000);
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let day = date.getDate();
    let dateString = `${month}/${day}/${year}`
    return {
        dateString: dateString,
        day: date.getDay()
    };
}

function displayWeeklyForecast(weekArr) {
    const container = document.getElementById("weekly")
    container.innerHTML = ""
    for (let i = 0; i < weekArr.length; i++) {
        const element = weekArr[i];
        let dateObject = convertLinuxTime(element.dt)
        container.innerHTML += `<div class="ui card">
        <div class="content">
          <div class="header"><p>${convertDays(dateObject.day)}, ${dateObject.dateString}</p><img src="${iconURL}${element.weather[0].icon}.png" /></div>
          <p>${element.weather[0].description}</p>
        </div>
              <p>Min Temp: ${element.temp.min}</p><p>Max Temp: ${element.temp.max}</p>
              <p>Wind: ${element.wind_speed} mph</p>
              <p>Humidity: ${element.humidity}%</p>
        </div>`
    }
}

function convertDays(dayNum) {
    switch (dayNum) {
        case 0:
            return "Sunday"
        case 1:
            return "Monday"
        case 2:
            return "Tuesday"
        case 3:
            return "Wednesday"
        case 4:
            return "Thursday"
        case 5:
            return "Friday"
        case 6:
            return "Saturday"

    }
}

function citySearchHistory(searchTerm) {
    let searchHistoryArr = localStorage.getItem("cityHistory")
    if (searchHistoryArr === null) {
        let arr = []
        arr.push(searchTerm)
        const stringArr = JSON.stringify(arr)
        localStorage.setItem("cityHistory", stringArr)
    }
    else {
        let parsedArray = JSON.parse(searchHistoryArr)
        parsedArray.push(searchTerm)
        const set = new Set(parsedArray)
        const uniqueArray = Array.from(set)
        localStorage.setItem("cityHistory", JSON.stringify(uniqueArray))
    }
}

function zipSearchHistory(searchTerm) {
    let searchHistoryArr = localStorage.getItem("zipHistory")
    if (searchHistoryArr === null) {
        let arr = []
        arr.push(searchTerm)
        const stringArr = JSON.stringify(arr)
        localStorage.setItem("zipHistory", stringArr)
    }
    else {
        let parsedArray = JSON.parse(searchHistoryArr)
        parsedArray.push(searchTerm)
        const set = new Set(parsedArray)
        const uniqueArray = Array.from(set)
        localStorage.setItem("zipHistory", JSON.stringify(uniqueArray))
    }
}

function coordSearchHistory(coordArr) {
    let searchHistoryArr = localStorage.getItem("coordHistory")
    if (searchHistoryArr === null) {
        let arr = []
        arr.push({ lat: coordArr[0], lon: coordArr[1]})
        const stringArr = JSON.stringify(arr)
        localStorage.setItem("coordHistory", stringArr)
    }
    else {
        let parsedArray = JSON.parse(searchHistoryArr)
        parsedArray.push({ lat: coordArr[0], lon: coordArr[1]})
        const set = new Set(parsedArray)
        const uniqueArray = Array.from(set)
        localStorage.setItem("coordHistory", JSON.stringify(uniqueArray))
    }
}

function generateDropdown(localStorageKey) {
    let searchHistoryArr = localStorage.getItem(localStorageKey)
    if (searchHistoryArr !== null) {
        let parsedArray = JSON.parse(searchHistoryArr)
        let menu = document.querySelector(".menu")
        console.log(menu, parsedArray)
        for (let index = 0; index < parsedArray.length; index++) {
            const element = parsedArray[index];
            const div = document.createElement("div")
            div.classList.add("item")
            div.textContent = element;
            div.addEventListener("click", e => {
                let addText = document.getElementById("zipSearch") || document.getElementById("citySearch")
                addText.value = e.target.textContent
                debounceSearchWeather("zipSearch", {zip: e.target.textContent})
            })
            menu.append(div)
            console.log(menu)
        }
    }
}
