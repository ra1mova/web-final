document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.querySelector('.login-form');
    const registerLink = document.getElementById('registerLink');

    // Handle the registration form submission
    registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Perform registration logic, for example, save user data to the mock API
        registerUser(email, password);
    });

    // Handle the "Do you have already an account?" link click
    const loginLink = document.getElementById('registerLink');
    loginLink.addEventListener('click', function(event) {
        event.preventDefault();
        // Redirect to the login.html page
        window.location.href = 'login.html';
    });
});

async function registerUser(email, password) {
    // Replace the URL with your mock API endpoint
    const apiUrl = 'https://65759ce4b2fbb8f6509d46ca.mockapi.io/todos/users';

    const isUserExist = await findUser(email)

    if (!isUserExist) {
        console.log("User does not exist")
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Registration successful', data);
            // Handle the registration success as needed (e.g., redirect to login page)
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error during registration:', error);
            // Handle the registration error as needed
        });
    } else {
        alert('Register failed: user with this email already exists.');
    }

    // Perform a POST request to register the user
    
}

async function findUser(email) {
    const url = new URL("https://65759ce4b2fbb8f6509d46ca.mockapi.io/todos/users")
    url.searchParams.append("email", email)
    let isUserExist = false;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
            isUserExist = true;
        }
    } catch (error) {
        console.error("Error during fetch:", error);
    }

    console.log("Is user exist: ", isUserExist);
    return isUserExist;
}
