# Weater App Challenge - TheOdinProject
This is my solution to the [Weather App Challenge](https://www.theodinproject.com/lessons/node-path-javascript-weather-app) provided by [TheOdinProject](https://TheOdinProject.com).

## The challenge
The challenge was to create a weather app using the [Visual Crossing API](https://www.visualcrossing.com/) that allows users to get basic information about the weather at their location. There should be a section that displays weather info on today and a section that forecasts the weather on the following days. Additionally, a loading animation could be implemented to show users especially on low end devices that data is being requested from the server.

## Built with
- [Visual Crossing API](https://www.visualcrossing.com/)


## My Process
I already built an application that uses the fetch API to retrieve data from a server but in this project it should be done using try/catch syntax that looks way more precise in my opinion. My simplified implementation looks like this:

```js
const makeRequest = async location => {
    try {
        displayLoading()
        const response = await fetch(url + location)
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
```
You may have noticed that I explicitly check for the http 400 error code because the Visual Crossing API sends this code when a location could not be found.

## Assets
- [Ionicons](https://ionic.io/ionicons): An icon library developed by the Ionic Framework team
- [Open Sans from Google Fonts](https://fonts.google.com/specimen/Open+Sans): A sans-serif typeface

## Design Inspiration
I used [Galileo AI](https://www.usegalileo.ai/explore) to design a basic mobile interface and then adjusted the design to my needs.
