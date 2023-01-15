const cpet_token = sessionStorage.getItem('token')
const cpet = {
    form: document.getElementById('application'),
    petID: 0,
    name: document.getElementById('cname'),
    age: document.getElementById('cage'),
    breed: document.getElementById('cbreed'),
    type: document.getElementById('ctype'),
    image: document.getElementById('cimage'),
    adopted: document.getElementById('cadopted'),
    error: document.getElementById('perror'),
    submit: document.getElementById('submitApp'),
}

const generateID = () => {
    return Math.floor(1000 + Math.random() * 9000);
}

cpet.petID = generateID()

if (cpet_token) {
    cpet.form.addEventListener('submit', e => {
        e.preventDefault()

        const data = {
            name: cpet.name.value,
            age: cpet.age.value,
            petID: cpet.petID,
            breed: cpet.breed.value,
            type: cpet.type.value,
            image: cpet.image.value,
            adopted: cpet.adopted.value
        }

        let options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${cpet_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        fetch(`/projects/pet-web/api/pets/create`, options).then(response => {
            response.json().then(d => {
                console.log(d)
            })
            if (response.status != 400) {
                cpet.error.style.color = "green"
                cpet.error.innerHTML = "Pet created!"
            } else {
                cpet.error.style.color = "red"
                cpet.error.innerHTML = "Recheck your form fields to make sure everything is correct"
            }
        })
    })

} else {
    cpet.form.innerHTML = "<br><br><h1>You need to be an admin to access this page</h1>"
}