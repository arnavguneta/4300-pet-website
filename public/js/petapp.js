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
    error: document.getElementById('loginerror')
}
const petapp_token = sessionStorage.getItem('token')
let update_pet = false

if (!petapp_token) {
    window.location.href = "http://localhost:3000/login"
    alert("You need to be logged in to access that page")
} else {
    let options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${petapp_token}`,
            'Content-Type': 'application/json'
        }
    }

    petapp.form.addEventListener('submit', e => {
        e.preventDefault()

        // get user id
        fetch(`/api/users/me`, options).then(response => {
            if (response.status != 401) {
                response.json().then(data => {
                    let formData = {
                        user: data._id,
                        name: `${petapp.fname.value} ${petapp.lname.value}`,
                        email: petapp.email.value,
                        petIDs: petapp.petIDs.value.split(','),
                        number: `${petapp.number.area.value}${petapp.number.d.value}`,
                        address: `${petapp.address.street1.value} ${petapp.address.street2.value}, ${petapp.address.city.value}, ${petapp.address.state.value}, ${petapp.address.zip.value}`,
                        reason: petapp.reason.value
                    }

                    formData.petIDs.forEach(pid => {
                        fetch(`/api/pets/${pid}`, options).then(r => {
                            if (r.status == 404 || r.status == 500) {
                                petapp.error.style.color = 'red'
                                petapp.error.innerHTML = `Pet with ID: ${pid} doesn't exist`
                                return
                            } else {
                                r.json().then(d => {
                                    if (d.adopted) {
                                        petapp.error.style.color = 'red'
                                        petapp.error.innerHTML = `Pet with ID: ${pid} has already been adopted`
                                        return
                                    } else {
                                        update_pet = true
                                    }
                                })
                            }
                        })
                    })

                    options = {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${petapp_token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    }
                    fetch(`/api/petapps/create`, options).then(response2 => {
                        if (response2.status != 400) {
                            // add petapp id to user
                            response2.json().then(rdata => {
                                formData = {
                                    petapp: rdata.petapp._id
                                }
                                options = {
                                    method: 'PATCH',
                                    headers: {
                                        'Authorization': `Bearer ${petapp_token}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(formData)
                                }
                                fetch(`/api/users/${data._id}`, options).then(response3 => {
                                    response3.json().then(udata => {
                                        console.log(udata)
                                    })
                                    petapp.error.style.color = "green"
                                    petapp.error.innerHTML = "Form submitted!"
                                })
                            }) 
                        } else {
                            
                            petapp.error.style.color = "red"
                            petapp.error.innerHTML = "Either you have errors in your form or you have already submitted a form!"
                        }
                    })
                })
            } else {
                console.log("Error with fetching user info")
            }
        })
    })
}