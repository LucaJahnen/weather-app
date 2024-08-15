const icons = {
    "rain": '<ion-icon name="rainy-outline"></ion-icon>',
    "cloudy": '<ion-icon name="cloudy-outline"></ion-icon>',
    "partly-cloudy-day": '<ion-icon name="partly-sunny-outline"></ion-icon>',
    "clear-day": '<ion-icon name="sunny-outline"></ion-icon>'
}

const handleError = () => {
    document.querySelector(".temperature").textContent = "404"
    document.querySelector(".conditions").textContent = "Your desired location could not be found. Please make sure to spell it correctly or try again later."
    document.querySelector(".days").innerHTML = ""
    document.querySelector(".forecast").style.display = "none"
    document.querySelector(".address").textContent = ""
}

const displayLoading = () => {
    document.querySelector(".loading").style.display = "block"
    document.querySelector(".temperature").textContent = ""
    document.querySelector(".conditions").textContent = ""
    document.querySelector(".forecast").style.display = "none"
    document.querySelector(".days").innerHTML = ""
    document.querySelector(".address").textContent = ""
    document.querySelector(".welcome").style.display = "none"
}

const hideLoading = () => {
    document.querySelector(".loading").style.display = "none"
}

const makeRequest = async (location) => {
    try {
        displayLoading()
        const response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=6UZ2TN2M7RTSFRPSML95A59PA&contentType=json`)
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
    const days = response.days
    const temperature = response.currentConditions.temp
    const conditions = response.description
    let address = response.resolvedAddress
    const commaIndex = address.indexOf(",")
    address = address.slice(0, commaIndex)
    return { days, temperature, conditions, address }
}

const displayDays = days => {
    const date = new Date()
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    document.querySelector(".days").innerHTML = ""
    days.map((day, index) => {
       if(index < 5) {
        const element = 
        `<section>
            <div class="img-wrapper">
                ${icons[day.icon]}
            </div>
            <p>${index === 0 ? "Today" : daysOfWeek[date.getDay() + index]}</p>
            <p>${Math.round(day.tempmin)}°C - ${Math.round(day.tempmax)}°C</p>
        </section>`
        const div = document.createElement("div")
        div.innerHTML = element
        document.querySelector(".days").appendChild(div)
       }
    })
}

const displayData = async (temperature, conditions, address) => {
    document.querySelector(".address").textContent = address.charAt(0).toUpperCase() + address.slice(1)
    document.querySelector(".temperature").textContent = temperature + "°C"
    document.querySelector(".conditions").textContent = conditions
    document.querySelector(".forecast").style.display = "block"
}


const form = document.querySelector(".location-form")
form.addEventListener("submit", async e => {
    e.preventDefault()
    const location = form.querySelector("input").value
    const data = await makeRequest(location)
    console.log(data)
    const { days, temperature, conditions, address } = formatResponse(data)
    displayData(temperature, conditions, address)
    displayDays(days)
})