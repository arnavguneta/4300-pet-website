const main = document.querySelector('main')
const login_token = sessionStorage.getItem('token')

const logout = () => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${login_token}`,
            'Content-Type': 'application/json'
        }
    }
    fetch(`/projects/pet-web/api/users/logallout`, options).then(response => {
        if (response.status != 500) {
            sessionStorage.removeItem('token')
            window.location.href = "https://arnav.guneta.com/projects/pet-web"
        } else {
            console.log("Error with logging out")
        }
    })
}

const home = () => {
    window.location.href = "https://arnav.guneta.com/projects/pet-web"
}

if (login_token) {
    main.innerHTML = `
        <br>
        <h1 id="logoutheader">You are logged in!</h1>
        <h3>Would you like to <span style="color:red">log out</span>?</h3>
        <button onclick="logout()" id="logoutyes" class="logoutbutton">Yes</button>
        <button onclick="home()" id="logoutno" class="logoutbutton">No</button>
    `
} else {
    const login = {
         form: document.getElementById('loginForm'),
         login: document.getElementById('submitlogin'),
         email: document.getElementById('loginemail'),
         password: document.getElementById('loginpassword'),
         error: document.getElementById('loginerror')
    }
    
    login.form.addEventListener('submit', (e) => {
        e.preventDefault()
        login.error.style.color = "red"
        login.error.innerHTML = ""

        const reqdata = {
            email: login.email.value,
            password: login.password.value
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqdata)
        }
        fetch('/projects/pet-web/api/users/login', options).then((response) => {
            if (response.status == 400) {
                login.error.innerHTML = "Either incorrect email or password!"
            } else {
                response.json().then(data => {
                    login.error.style.color = "green"
                    login.error.innerHTML = "Success!"
                    window.setTimeout(1000)
                    sessionStorage.setItem('token', data.token)
                    window.location.href = "https://arnav.guneta.com/projects/pet-web"
                })
            }
        })
    })
}

