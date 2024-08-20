document.addEventListener('DOMContentLoaded', function() {
    const signInButton = document.getElementById('sign_in');
    const loadingScreen = document.getElementById('loading');
    const form_container = document.getElementById('form_container');

    // Function to toggle loading screen visibility
    const toggleLoadingScreen = (show) => {
        if (show) {
            loadingScreen.style.display = 'flex';
            form_container.style.display = 'none';
        } else {
            loadingScreen.style.display = 'none';
        }
    };

    // Function to handle login process
    const handleLogin = () => {
        toggleLoadingScreen(true);  // Show loading screen

        const email = document.getElementById('login_email').value;
        const password = document.getElementById('login_password').value;

        // Validate email and password input
        if (!email || !password) {
            alert('Please enter both email and password.');
            toggleLoadingScreen(false);  // Hide loading screen if validation fails
            return;
        }

        // Perform login request
        fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                // Hide loading screen and show form container if login fails
                toggleLoadingScreen(false);
                form_container.style.display = 'flex';  // Show form container on error
                alert(data.error);  // Show error message
            } else {
                // Hide loading screen and redirect immediately on successful login
                toggleLoadingScreen(false);
                window.location.href = '/dashboard';  // Redirect to dashboard
            }
        })
        .catch(error => {
            // Hide loading screen and show form container on error
            toggleLoadingScreen(false);
            form_container.style.display = 'flex';  // Show form container on error
            console.error('Error:', error);
            alert('An error occurred during the login process. Please try again later.');
        });
    };

    // Event listener for sign-in button
    signInButton.addEventListener('click', handleLogin);
});
