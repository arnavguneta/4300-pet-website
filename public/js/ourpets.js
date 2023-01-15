
const pets = {
    table: document.getElementsByClassName('ourpets')[0],
		p: document.getElementsByClassName('alt-nopets')[0],
}

fetch('/projects/pet-web/api/pets/all').then(response => {
    response.json().then(data => {
        console.log(data)
				if (data.length === 0) return;
				pets.table.innerHTML = ''
				pets.p.innerHTML = ''
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
