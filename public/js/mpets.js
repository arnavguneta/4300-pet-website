const mpet_token = sessionStorage.getItem('token')
const pet_app = {
    dropdown: document.getElementById('slctpets'),
    form: document.getElementById('application'),
    petID: 0,
    name: document.getElementById('petname'),
    age: document.getElementById('petage'),
    breed: document.getElementById('petbreed'),
    type: document.getElementById('pettype'),
    image: document.getElementById('petimage'),
    adopted: document.getElementById('petadopted'),
    error: document.getElementById('perror'),
    submit: document.getElementById('submitApp'),
}
let db = {}

if (mpet_token) {
    pet_app.form.addEventListener('submit', e => {
        e.preventDefault()
        if (pet_app.submit.value.toLowerCase() === 'edit') {
            pet_app.name.readOnly = false
            pet_app.age.readOnly = false
            pet_app.breed.readOnly = false
            pet_app.type.readOnly = false
            pet_app.image.readOnly = false
            pet_app.adopted.readOnly = false
            pet_app.submit.value = 'Save'
            pet_app.error.innerHTML = ''
        } else {
            const update_data = {
                name: pet_app.name.value,
                age: pet_app.age.value,
                breed: pet_app.breed.value,
                type: pet_app.type.value,
                image: pet_app.image.value,
                adopted: pet_app.adopted.value
            }

            options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${mpet_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(update_data)
            }
            fetch(`/projects/pet-web/api/pets/${pet_app.petID}`, options).then((uresponse) => {
                uresponse.json().then(udata => {
                    console.log(udata)
                    if (uresponse.status == 400) {
                        pet_app.error.style.color = "red"
                        pet_app.error.innerHTML = "There are issues with your information!"
                    } else {
                        pet_app.name.readOnly = true
                        pet_app.age.readOnly = true
                        pet_app.breed.readOnly = true
                        pet_app.type.readOnly = true
                        pet_app.image.readOnly = true
                        pet_app.adopted.readOnly = true
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
            'Authorization': `Bearer ${mpet_token}`,
            'Content-Type': 'application/json'
        }
    }

    fetch(`/projects/pet-web/api/users/me`, options).then(response => {
        if (response.status != 401) {
            response.json().then(data => {
                if (!data.isAdmin) {
                    window.location.href = 'https://arnav.guneta.com/projects/pet-web/'
                    alert('Insufficient perms')
                }
            })
            fetch(`/projects/pet-web/api/pets/all`).then(allresponse => {
                allresponse.json().then(alldata => {
                    db = alldata
                    alldata.forEach(petapp => {
                        pet_app.dropdown.innerHTML += `<option value=\"${petapp.petID}\">${petapp.petID} ${petapp.name} [${petapp.type}]</option>`
                    })
                })
            })
        }
    })
} else {
    pet_app.form.innerHTML = "<br><br><h1>You need to be an admin to access this page</h1>"
}

const findByName = (petID) => {
    for (let i = 0; i < db.length; i++) {
        if (db[i].petID == petID) {
            return i
        }
    }
}
const loadData = () => {
    options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${mpet_token}`,
            'Content-Type': 'application/json'
        }
    }
    let selectedLoadData = db[findByName(pet_app.dropdown.value)]
    console.log(findByName(pet_app.dropdown.value))
    console.log(pet_app.dropdown.value)
    pet_app.petID = selectedLoadData.petID
    pet_app.name.value = selectedLoadData.name
    pet_app.age.value = selectedLoadData.age
    pet_app.breed.value = selectedLoadData.breed
    pet_app.type.value = selectedLoadData.type
    pet_app.image.value = selectedLoadData.image
    pet_app.adopted.value = selectedLoadData.adopted

}