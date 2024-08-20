document.addEventListener('DOMContentLoaded', () => {
    const submit = document.getElementById('submitbtn');

    submit.addEventListener('click', () => {
        const id = parseInt(document.getElementById('id').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const where = parseInt(document.getElementById('where').value);
        const description = document.getElementById('description').value;

        fetch('/api/assets/transfer', {  // Corrected fetch call
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                asset_id: id,
                quantity: quantity,
                where: where,
                description: description
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
