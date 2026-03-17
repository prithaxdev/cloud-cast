import axios from "axios"

export const weatherApi = axios.create({
  baseURL: "https://api.open-meteo.com/v1",
})

export const geocodingApi = axios.create({
  baseURL: "https://geocoding-api.open-meteo.com/v1",
})
