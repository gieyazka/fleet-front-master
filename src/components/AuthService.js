import decode from 'jwt-decode';
import server from '../config';
import axios from 'axios';

export default class AuthService {
    // Initializing important variables
    constructor() {
        this.domain = server.url // API server domain
        this.fetch = this.fetch.bind(this) // React binding stuff
        this.login = this.login.bind(this)
        this.getProfile = this.getProfile.bind(this)
    }

    login(identifier, password) {
        // axios.post(`${this.domain}/auth/local`).then(res => console.log(res));
        // setTimeout(5000);
        // alert('wait');
        // Get a token from api server using the fetch api
        return axios.post(`${this.domain}/auth/local`,
           {
                identifier,
                password
            }
        ).then(res => {
            console.log(res);
            this.setToken(res.data.jwt) // Setting the token in localStorage
            /** Save user data to localStorage */
            // localStorage.setItem('res', JSON.stringify(res.data))
            localStorage.setItem('username', res.data.user.username)
            localStorage.setItem('role', res.data.user.role.name)
            localStorage.setItem('companyID', res.data.user.company)
            localStorage.setItem('department', res.data.user.department)
            // localStorage.setItem('res', JSON.stringify(res.data));
            localStorage.setItem('supplierID', res.data.user.supplier)
            return Promise.resolve(res.data);
        }).catch(err => {
            // localStorage.setItem('error',JSON.stringify(err));        
            localStorage.clear(); 
            alert('error');
        })
    }

    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken() // GEtting token from localstorage
        return !!token && !this.isTokenExpired(token) // handwaiving here
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token')
    }

    logout() {
        // Clear user token and profile data from localStorage
        window.location.reload();
        return localStorage.clear(); 
    }

    getProfile() {
        // Using jwt-decode npm package to decode the token
        return decode(this.getToken());
    }


    fetch(url, options) {
        // performs api calls sending the required authentication headers
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        // Setting Authorization header
        // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        // raises an error in case response status is not a success
        if (response.status >= 200 && response.status < 400) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.response = response
            throw error
        }
    }
}