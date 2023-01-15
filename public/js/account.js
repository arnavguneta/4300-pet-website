const account = {
    id: 0,
    petapp: 0,
    name: document.getElementById('accountname'),
    age: document.getElementById('accountage'),
    email: document.getElementById('accountemail'),
    password: document.getElementById('accountpass'),
    form: document.getElementById('loginForm'),
    error: document.getElementById('loginerror'),
    reqadmin: document.getElementById('reqadmin'),
    reqadminstatus: document.getElementById('reqadminstatus')
}

const petapp = {
    form: document.getElementById('application'),
    userID: 0,
    fname: document.getElementById('pfname'),
    lname: document.getElementById('plname'),
    petIDs: document.getElementById('pids'),
    email: document.getElementById('pemail'),
    number: {
        area: document.getElementById('parea'),
        d: document.getElementById('pnumber')
    },
    address: {
        street1: document.getElementById('paddress1'),
        street2: document.getElementById('paddress2'),
        city: document.getElementById('pcity'),
        state: document.getElementById('pstate'),
        zip: document.getElementById('pzip')
    },
    reason: document.getElementById('why'),
    error: document.getElementById('perror'),
    submit: document.getElementById('submitApp'),
    approved: document.getElementById('papproved')
}

const admin = {
    sect: document.getElementById('admin'),
    manage_pets: document.getElementById('mpets'),
    form: document.getElementById('admin'),
    manage_petapps: document.getElementById('musers')
}

const acc_main = document.querySelector('main')
const account_token = sessionStorage.getItem('token')

const login = () => {
    window.location.href = "https://arnav.guneta.com/projects/pet-web/login"
}

const home = () => {
    window.location.href = "https://arnav.guneta.com/projects/pet-web"
}

const manualLogOut = () => {
    window.location.href = "https://arnav.guneta.com/projects/pet-web/login"
}

const reqadmin = () => {
    let options = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${account_token}`,
            'Content-Type': 'application/json'
        }
    }
    fetch(`/api/users/reqadmin`, options).then(response => {
        if (response.ok) {
            account.reqadminstatus.style.color = "green"
            account.reqadminstatus.innerHTML = 'Your request for admin access has been submitted'
        } else {
            account.reqadminstatus.style.color = "red"
            account.reqadminstatus.innerHTML = 'Something went wrong'
        }
    })
}

let options = {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${account_token}`,
        'Content-Type': 'application/json'
    }
}

if (account_token) {
    const edit_acc = document.getElementById('editacc')
    

    fetch(`/api/users/me`, options).then(response => {
        if (response.status != 401) {
            response.json().then(data => {
                console.log(data)
                account.petapp = data.petapp
                account.id = data._id
                account.name.value = data.name
                account.age.value = data.age
                account.email.value = data.email
                account.password.value = data.password

                // if (data.isAdmin) account.reqadmin.innerHTML = ''
                if (!data.isAdmin) admin.sect.innerHTML = ''
                if (account.petapp == 0) {
                    petapp.form.innerHTML = ""
                } else {
                    options = {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${account_token}`,
                            'Content-Type': 'application/json'
                        }
                    }

                    fetch(`/api/petapps/${account.petapp}`, options).then(response => {
                        if (response.status != 404 && response.status != 500) {
                            response.json().then(data => {
                                const data_name = data.name.split(" ")
                                petapp.fname.value = data_name[0]
                                petapp.lname.value = data_name[1]
                                petapp.petIDs.value = data.petIDs.join()
                                petapp.email.value = data.email
                                petapp.number.area.value = data.number.substring(0, 3)
                                petapp.number.d.value = data.number.substring(3, 10)
                                const address = data.address.split(',')
                                petapp.address.street1.value = address[0].trim()
                                petapp.address.city.value = address[1].trim()
                                petapp.address.state.value = address[2].trim()
                                petapp.address.zip.value = address[3].trim()
                                petapp.reason.value = data.reason
                                if (data.approved) {
                                    petapp.approved.style.color = "green"
                                    petapp.approved.innerHTML = "Yes"
                                }

                            })
                        }
                    })
                }
            })
        } else {
            console.log("Error with fetching user info")
        }
    })

    petapp.form.addEventListener('submit', e => {
        e.preventDefault()

        if (petapp.submit.value.toLowerCase() === 'edit') {
            petapp.fname.readOnly = false
            petapp.lname.readOnly = false
            petapp.petIDs.readOnly = false
            petapp.email.readOnly = false
            petapp.number.area.readOnly = false
            petapp.number.d.readOnly = false
            petapp.address.street1.readOnly = false
            petapp.address.street2.readOnly = false
            petapp.address.city.readOnly = false
            petapp.address.state.readOnly = false
            petapp.address.zip.readOnly = false
            petapp.reason.readOnly = false
            petapp.submit.value = 'Save'
        } else {
            const update_data = {
                name: `${petapp.fname.value} ${petapp.lname.value}`,
                email: petapp.email.value,
                petIDs: petapp.petIDs.value.split(','),
                number: `${petapp.number.area.value}${petapp.number.d.value}`,
                address: `${petapp.address.street1.value} ${petapp.address.street2.value}, ${petapp.address.city.value}, ${petapp.address.state.value}, ${petapp.address.zip.value}`,
                reason: petapp.reason.value
            }

            options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${account_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update_data)
            }
            fetch(`/api/petapps/${account.petapp}`, options).then((uresponse) => {
                uresponse.json().then(udata => {
                    console.log(udata)
                    if (uresponse.status == 400) {
                        petapp.error.style.color = "red"
                        petapp.error.innerHTML = "There are issues with your information!"
                    } else {
                        petapp.fname.readOnly = true
                        petapp.lname.readOnly = true
                        petapp.petIDs.readOnly = true
                        petapp.email.readOnly = true
                        petapp.number.area.readOnly = true
                        petapp.number.d.readOnly = true
                        petapp.address.street1.readOnly = true
                        petapp.address.street2.readOnly = true
                        petapp.address.city.readOnly = true
                        petapp.address.state.readOnly = true
                        petapp.address.zip.readOnly = true
                        petapp.reason.readOnly = true
                        petapp.submit.value = 'Edit'
                        petapp.error.style.color = "green"
                        petapp.error.innerHTML = "Success!"
                        window.setTimeout(1000)
                    }
                })
            })

        }

    })
    account.form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (edit_acc.value.toLowerCase() === 'edit') {
            account.name.readOnly = false
            account.age.readOnly = false
            account.email.readOnly = false
            account.password.readOnly = false
            account.password.value = ''
            edit_acc.value = 'Save'
        } else {
            const update_data = {
                email: account.email.value,
                password: account.password.value,
                age: account.age.value,
                name: account.name.value
            }

            options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${account_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update_data)
            }

            const id = account.id
            fetch(`/api/users/${id}`, options).then((uresponse) => {
                uresponse.json().then(udata => {
                    if (uresponse.status == 400) {
                        account.error.style.color = "red"
                        account.error.innerHTML = "There are issues with your information!"
                        const update_errors = Object.keys(udata.errors)
                        console.log(update_errors)
                        update_errors.forEach(ekey => {
                            document.getElementsByClassName(`u${ekey}`)[0].innerHTML = udata.errors[ekey].message
                        });
                    } else {
                        Array.from(document.getElementsByClassName('loginrequired')).forEach(element => {
                            element.innerHTML = '*'
                        });
                        account.name.readOnly = true
                        account.age.readOnly = true
                        account.email.readOnly = true
                        account.password.readOnly = true
                        edit_acc.value = 'Edit'
                        account.error.style.color = "green"
                        account.error.innerHTML = "Success!"
                        window.setTimeout(1000)
                    }
                })
            })
        }
    })
} else {
    acc_main.innerHTML = `
        <br>
        <h1 id="accountheader">Not logged in!</h1>
        <h3>Would you like to <span style="color:green">log in</span>?</h3>
        <button onclick="login()" id="loginyes" class="logoutbutton">Yes</button>
        <button onclick="home()" id="loginno" class="logoutbutton">No</button>
    `

}