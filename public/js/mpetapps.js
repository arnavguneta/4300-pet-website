const m_token = sessionStorage.getItem('token')
const pet_app = {
    dropdown: document.getElementById('apps'),
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
    approval: {
        slct: document.getElementById('approval'),
        yes: document.getElementById('appryes'),
        no: document.getElementById('apprno')
    }
}
let db = {}
let pet_id = 0

if (m_token) {
    pet_app.form.addEventListener('submit', e => {
        e.preventDefault()
        if (pet_app.submit.value.toLowerCase() === 'edit') {
            pet_app.fname.readOnly = false
            pet_app.lname.readOnly = false
            pet_app.petIDs.readOnly = false
            pet_app.email.readOnly = false
            pet_app.number.area.readOnly = false
            pet_app.number.d.readOnly = false
            pet_app.address.street1.readOnly = false
            pet_app.address.street2.readOnly = false
            pet_app.address.city.readOnly = false
            pet_app.address.state.readOnly = false
            pet_app.address.zip.readOnly = false
            pet_app.reason.readOnly = false
            pet_app.submit.value = 'Save'
            pet_app.error.innerHTML = ''
        } else {
            let approved = false
            if (pet_app.approval.slct.value === "yes") {
                approved = true
            }
            const update_data = {
                name: `${pet_app.fname.value} ${pet_app.lname.value}`,
                email: pet_app.email.value,
                petIDs: pet_app.petIDs.value.split(','),
                number: `${pet_app.number.area.value}${pet_app.number.d.value}`,
                address: `${pet_app.address.street1.value} ${pet_app.address.street2.value}, ${pet_app.address.city.value}, ${pet_app.address.state.value}, ${pet_app.address.zip.value}`,
                reason: pet_app.reason.value,
                approved
            }

            if (approved) {
                upetdata = {
                    adopted: true
                }
                console.log('updating pet')
                options = {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${m_token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(upetdata)
                }

                update_data.petIDs.forEach(id => {
                    fetch(`/api/pets/${id}`, options).then(r => {
                        r.json().then(d => {
                            console.log(d)
                        })
                        if (r.status == 400) {
                            console.log("Error updating pets!")
                        }
                    })
                })
            }

            options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${m_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update_data)
            }
            fetch(`/api/petapps/${pet_id}`, options).then((uresponse) => {
                uresponse.json().then(udata => {
                    console.log(udata)
                    if (uresponse.status == 400) {
                        pet_app.error.style.color = "red"
                        pet_app.error.innerHTML = "There are issues with your information!"
                    } else {
                        pet_app.fname.readOnly = true
                        pet_app.lname.readOnly = true
                        pet_app.petIDs.readOnly = true
                        pet_app.email.readOnly = true
                        pet_app.number.area.readOnly = true
                        pet_app.number.d.readOnly = true
                        pet_app.address.street1.readOnly = true
                        pet_app.address.street2.readOnly = true
                        pet_app.address.city.readOnly = true
                        pet_app.address.state.readOnly = true
                        pet_app.address.zip.readOnly = true
                        pet_app.reason.readOnly = true
                        pet_app.submit.value = 'Edit'
                        pet_app.error.style.color = "green"
                        pet_app.error.innerHTML = "Form updated!"
                        window.setTimeout(1000)
                    }
                })
            })
        }
    })

    let options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${m_token}`,
            'Content-Type': 'application/json'
        }
    }

    fetch(`/api/users/me`, options).then(response => {
        if (response.status != 401) {
            response.json().then(data => {
                if (!data.isAdmin) {
                    window.location.href = 'http://localhost:3000/'
                    alert('Insufficient perms')
                }
            })
            fetch(`/api/petapps/all`).then(allresponse => {
                allresponse.json().then(alldata => {
                    db = alldata
                    alldata.forEach(petapp => {
                        apps.innerHTML += `<option value=\"${petapp.name}\">${petapp.name}'s Application</option>`
                    })
                })
            })
        }
    })
} else {
    pet_app.form.innerHTML = "<br><br><h1>You need to be an admin to access this page</h1>"
}

const findByName = (name) => {
    for (let i = 0; i < db.length; i++) {
        if (db[i].name == name) {
            return i
        }
    }
}
const loadData = () => {
    options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${m_token}`,
            'Content-Type': 'application/json'
        }
    }
    let selectedLoadData = db[findByName(pet_app.dropdown.value)]
    console.log(findByName(pet_app.dropdown.value))
    console.log(pet_app.dropdown.value)
    pet_id = selectedLoadData._id
    const data_name = selectedLoadData.name.split(" ")
    pet_app.fname.value = data_name[0]
    pet_app.lname.value = data_name[1]
    pet_app.petIDs.value = selectedLoadData.petIDs.join()
    pet_app.email.value = selectedLoadData.email
    pet_app.number.area.value = selectedLoadData.number.substring(0, 3)
    pet_app.number.d.value = selectedLoadData.number.substring(3, 10)
    const address = selectedLoadData.address.split(',')
    pet_app.address.street1.value = address[0].trim()
    pet_app.address.city.value = address[1].trim()
    pet_app.address.state.value = address[2].trim()
    pet_app.address.zip.value = address[3].trim()
    pet_app.reason.value = selectedLoadData.reason
    if (selectedLoadData.approved) pet_app.approval.yes.selected = true
}