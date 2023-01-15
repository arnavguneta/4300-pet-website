const logintext = document.getElementById('updateLogin')

const token = sessionStorage.getItem('token');
if (token) {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    fetch(`/projects/pet-web/api/users/update`, options).then(response => {
        console.log(response)
        response.json().then(data => {
            logintext.innerHTML = `Welcome, <a id="account" href="/account"><b>${data.name}</b></a>!`
        })

    })
}