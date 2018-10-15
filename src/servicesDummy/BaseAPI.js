import axios from "axios"

// let baseURL = 'http://192.168.43.249:8081'
let baseURL = "http://localhost:8081"

export default function() {
    return axios.create({
        baseURL: baseURL
    })
}
