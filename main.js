const address = document.querySelector(".address")
const temperature = document.querySelector(".temperature")
const conditions = document.querySelector(".conditions")
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
    const location = document.querySelector(".address").textContent
    const data = await makeRequest(location, unitInput.checked)
    const { daysArray, temperatureValue, conditionsValue, addressValue } = formatResponse(data)
    displayData(temperatureValue, conditionsValue, addressValue)
    displayDays(daysArray)
})

const handleError = () => {
    temperature.textContent = "404"
    conditions.textContent = "Your desired location could not be found. Please make sure to spell it correctly or try again later."
    days.innerHTML = ""
    forecast.style.display = "none"
    address.textContent = ""
}

const displayLoading = () => {
    loading.style.display = "block"
    temperature.textContent = ""
    conditions.textContent = ""
    forecast.style.display = "none"
    days.innerHTML = ""
    address.textContent = ""
}

const hideLoading = () => {
    loading.style.display = "none"
}

const makeRequest = async (location, isCelsius) => {
    const unit = isCelsius ? "metric" : "us"
    try {
        displayLoading()
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=${unit}&key=6UZ2TN2M7RTSFRPSML95A59PA&contentType=json`)
        if(response.status === 400 || !response.ok) {
            handleError()
        }
        const data = response.json()
        hideLoading()
        return data
    } catch(error) {
        handleError()
    }
}

const formatResponse = response => {
    const daysArray = response.days
    const temperatureValue = response.currentConditions.temp
    const conditionsValue = response.description
    let addressValue = response.resolvedAddress
    const commaIndex = addressValue.indexOf(",")
    addressValue = addressValue.slice(0, commaIndex)
    return { daysArray, temperatureValue, conditionsValue, addressValue }
}

const displayDays = daysArray => {
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

const displayData = (temperatureValue, conditionsValue, addressValue) => {
    address.textContent = addressValue.charAt(0).toUpperCase() + addressValue.slice(1)
    temperature.textContent = unitInput.checked ? temperatureValue + "°C" : temperatureValue + "°F"
    conditions.textContent = conditionsValue
    forecast.style.display = "block"
}


const form = document.querySelector(".location-form")
form.addEventListener("submit", async e => {
    e.preventDefault()
    const location = form.querySelector("input").value
    const data = await makeRequest(location, unitInput.checked)
    const { daysArray, temperatureValue, conditionsValue, addressValue } = formatResponse(data)
    displayData(temperatureValue, conditionsValue, addressValue)
    displayDays(daysArray)
})

document.addEventListener("DOMContentLoaded", async () => {
    const data = await makeRequest("london", true)
    const { daysArray, temperatureValue, conditionsValue, addressValue } = formatResponse(data)
    displayData(temperatureValue, conditionsValue, addressValue)
    displayDays(daysArray)
})