const signupmain = document.querySelector('main')
const signup_token = sessionStorage.getItem('token')

const logout = () => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${signup_token}`,
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

if (signup_token) {
    signupmain.innerHTML = `
        <br>
        <h1 id="logoutheader">You are logged in!</h1>
        <h3>Would you like to <span style="color:red">log out</span>?</h3>
        <button onclick="logout()" id="logoutyes" class="logoutbutton">Yes</button>
        <button onclick="home()" id="logoutno" class="logoutbutton">No</button>
    `
} else {
    const signup = {
        form: document.getElementById('loginForm'),
        login: document.getElementById('submitlogin'),
        email: document.getElementById('signupemail'),
        password: document.getElementById('signuppassword'),
        name: document.getElementById('signupname'),
        age: document.getElementById('signupage'),
        error: document.getElementById('loginerror')
    }

    signup.form.addEventListener('submit', (e) => {
        e.preventDefault()
        signup.error.style.color = "red"
        signup.error.innerHTML = ""

        const signup_data = {
            email: signup.email.value,
            password: signup.password.value,
            age: signup.age.value,
            name: signup.name.value
        }

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signup_data)
        }
        fetch('/projects/pet-web/api/users/signup', options).then((response) => {
            response.json().then(data => {
                console.log(data)
                if (response.status == 400) {
                    signup.error.innerHTML = "There are issues with your information!"
                    const signup_errors = Object.keys(data.errors)
                    console.log(signup_errors)
                    signup_errors.forEach(ekey => {
                        document.getElementsByClassName(`s${ekey}`)[0].innerHTML = data.errors[ekey].message
                    }); 
                } else {
                    Array.from(document.getElementsByClassName('loginrequired')).forEach(element => {
                        element.innerHTML = '*'
                    });
                    signup.error.style.color = "black"
                    signup.error.innerHTML = "Success!"
                    window.setTimeout(1000)
                    sessionStorage.setItem('token', data.token)
                    window.location.href = "https://arnav.guneta.com/projects/pet-web"

                }
            })
        })
    })
}

