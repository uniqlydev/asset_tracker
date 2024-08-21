document.addEventListener('DOMContentLoaded', () => {
    const submit = document.getElementById('submitbtn');
    const notifications = document.querySelector('.top-right');
    const loadingScreen = document.getElementById('loading');
    const container = document.getElementById('container');

    const navbar__link = document.querySelector('.navbar__link');


    const toggleLoadingScreen = (show) => {
        if (show) {
            loadingScreen.style.display = 'flex';
            container.style.display = 'none';

        } else {
            loadingScreen.style.display = 'none';
        }
    };

    navbar__link.addEventListener('click', () => {
        toggleLoadingScreen(true);
    })


    submit.addEventListener('click', () => {
        const id = parseInt(document.getElementById('id').value);
        const quantity = parseInt(document.getElementById('quantity').value);
        const where = document.getElementById('where').value;
        const description = document.getElementById('description').value;

        fetch('/api/assets/transfer', {
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

            // Clear all notifications
            document.querySelectorAll('.top-right > div').forEach(notification => {
                notification.style.display = 'none';
            });
            notifications.classList.remove('show');

            // Show success notification
            document.querySelector('.check').style.display = 'flex';
            notifications.classList.add('show');

            // Clear fields
            document.getElementById('id').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('where').value = '';
            document.getElementById('description').value = '';

            // Hide after 5 seconds
            setTimeout(() => {
                notifications.classList.remove('show');
                document.querySelector('.check').style.display = 'none';
            }, 5000);
        })
        .catch(error => {
            console.error('Error:', error);

            // Clear all notifications
            document.querySelectorAll('.top-right > div').forEach(notification => {
                notification.style.display = 'none';
            });
            notifications.classList.remove('show');

            // Show error notification
            document.querySelector('.danger').style.display = 'flex';
            notifications.classList.add('show');

            // Hide after 5 seconds
            setTimeout(() => {
                notifications.classList.remove('show');
                document.querySelector('.danger').style.display = 'none';
            }, 5000);
        });
    });
});
