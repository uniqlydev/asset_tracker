document.addEventListener('DOMContentLoaded', function() {
    const sign_in = document.getElementById('sign_in');

    sign_in.addEventListener('click', function() {
        const email = document.getElementById('login_email').value;
        const password = document.getElementById('login_password').value;

        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                alert(data.error);
            } else {
                window.location.href = '/dashboard';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});
