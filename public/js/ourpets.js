
const pets = {
    table: document.getElementsByClassName('ourpets')[0]
}

pets.table.innerHTML = ''

fetch('/api/pets/all').then(response => {
    response.json().then(data => {
        console.log(data)
        data.forEach(p => {
            pets.table.innerHTML +=
                `
                <tr>
		            <td><img src="${p.image}" height="250"></td>
		            <td class="petinfo">
			            Name: ${p.name}<br>
			            <br>
			            Age: ${p.age}<br>
			            <br>
			            Breed: ${p.breed}<br>
			            <br>
			            Type: ${p.type}<br>
			            <br>
			            ID: ${p.petID}<br>
		            </td>
	            </tr>
                `
        })
    })
})
