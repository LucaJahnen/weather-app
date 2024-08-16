const address = document.querySelector(".address")
const temperature = document.querySelector(".temperature")
const feelslike = document.querySelector(".feelslike")
const sunrise = document.querySelector(".sunrise")
const sunset = document.querySelector(".sunset")
const humidity = document.querySelector(".humidity")
const uvindex = document.querySelector(".uv-index")
const windspeed = document.querySelector(".windspeed")
const conditionsWrapper = document.querySelector(".conditions-wrapper")
const conditions = document.querySelector(".conditions")
const cards = document.querySelector(".cards")
const days = document.querySelector(".days")
const forecast = document.querySelector(".forecast")
const loading = document.querySelector(".loading")

const icons = {
    "rain": '<ion-icon name="rainy-outline"></ion-icon>',
    "cloudy": '<ion-icon name="cloudy-outline"></ion-icon>',
    "partly-cloudy-day": '<ion-icon name="partly-sunny-outline"></ion-icon>',
    "clear-day": '<ion-icon name="sunny-outline"></ion-icon>'
}

// if checkbox is checked value is °C else °F
const unitInput = document.querySelector("#unit")
unitInput.addEventListener("change", async () => {
    const location = address.textContent
    const data = await makeRequest(location, unitInput.checked)
    displayData(data)
    displayDays(data)
})

const handleError = () => {
    temperature.textContent = "404"
    conditions.textContent = "Your desired location could not be found. Please make sure to spell it correctly or try again later."
    conditions.style.textAlign = "center"
    days.innerHTML = ""
    forecast.style.display = "none"
    address.textContent = ""
    cards.style.display = "none"
    conditionsWrapper.querySelector("h3").style.display = "none"
}

const displayLoading = () => {
    loading.style.display = "block"
    temperature.textContent = ""
    conditions.textContent = ""
    forecast.style.display = "none"
    cards.style.display = "none"
    days.innerHTML = ""
    address.textContent = ""
    conditionsWrapper.querySelector("h3").style.display = "none"
}

const hideLoading = () => {
    loading.style.display = "none"
    conditions.style.textAlign = "left"
    conditionsWrapper.querySelector("h3").style.display = "block"
    cards.style.display = "grid"
}

const makeRequest = async (location, isCelsius) => {
    const unit = isCelsius ? "metric" : "us"
    try {
        displayLoading()
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=6UZ2TN2M7RTSFRPSML95A59PA&contentType=json`)
        const data = response.json()
        hideLoading()
        if(response.status === 400 || !response.ok) {
            handleError()
        }
        return data
    } catch(error) {
        handleError()
    }
}

const formatResponse = response => {
    const daysArray = response.days
    const temperatureValue = response.currentConditions.temp
    const feelslikeValue = response.currentConditions.feelslike
    const sunriseValue = response.currentConditions.sunrise
    const sunsetValue = response.currentConditions.sunset
    const conditionsValue = response.description
    const windspeedValue = response.currentConditions.windspeed
    const uvindexValue = response.currentConditions.uvindex
    const humidityValue = response.currentConditions.humidity
    let addressValue = response.resolvedAddress
    const commaIndex = addressValue.indexOf(",")
    addressValue = addressValue.slice(0, commaIndex)
    return { daysArray, temperatureValue, feelslikeValue, windspeedValue, humidityValue, uvindexValue, sunriseValue, sunsetValue, conditionsValue, addressValue }
}

const displayDays = data => {
    const { daysArray } = formatResponse(data)
    const date = new Date()
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    days.innerHTML = ""
    const unit = unitInput.checked ? "°C" : "°F"
    daysArray.map((day, index) => {
       if(index < 5) {
        const element = 
        `<section>
            <div class="img-wrapper">
                ${icons[day.icon]}
            </div>
            <p>${index === 0 ? "Today" : daysOfWeek[date.getDay() + index] === undefined ? daysOfWeek[date.getDay() + index - 7]: daysOfWeek[date.getDay() + index]}</p>
            <p>${Math.round(day.tempmin) + unit} - ${Math.round(day.tempmax) + unit}</p>
        </section>`
        const div = document.createElement("div")
        div.innerHTML = element
        days.appendChild(div)
       }
    })
}

const displayData = data => {
    const {  temperatureValue, feelslikeValue, windspeedValue, humidityValue, uvindexValue, sunriseValue, sunsetValue, conditionsValue, addressValue } = formatResponse(data)
    address.textContent = addressValue.charAt(0).toUpperCase() + addressValue.slice(1)
    temperature.textContent = unitInput.checked ? temperatureValue +  "°C" : temperatureValue + "°F"
    feelslike.textContent = unitInput.checked ? feelslikeValue +  "°C" : feelslikeValue +  "°F"
    sunrise.textContent = sunriseValue.substring(0, sunriseValue.length - 3)
    sunset.textContent = sunsetValue.substring(0, sunsetValue.length - 3)
    windspeed.textContent = unitInput.checked ? windspeedValue + "km/h" : windspeedValue + "mp/h"
    humidity.textContent = humidityValue + "%"
    uvindex.textContent = uvindexValue
    conditions.textContent = conditionsValue
    forecast.style.display = "block"
}


const form = document.querySelector(".location-form")
form.addEventListener("submit", async e => {
    e.preventDefault()
    const location = form.querySelector("input").value
    const data = await makeRequest(location, unitInput.checked)
    displayData(data)
    displayDays(data)
})

document.addEventListener("DOMContentLoaded", async () => {
    const data = await makeRequest("london", true)
    console.log(data)
    displayData(data)
    displayDays(data)
})