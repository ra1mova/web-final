document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await login(email, password);
});

async function login(email, password) {
    console.log('Attempting login...'); // Debugging line

    const user = await findUser(email)

    if (user !== null) {
        if (user.password === password) {
            localStorage.setItem("isAuthenticated", true)
            window.location.href = 'task.html';
        } else {
            alert('Login failed: Invalid credentials.');
        }
    } else {
        alert('Login failed: Invalid credentials.');
    }
}

async function findUser(email) {
    const url = new URL("https://65759ce4b2fbb8f6509d46ca.mockapi.io/todos/users")
    url.searchParams.append("email", email)
    let user = null;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
           user = data[0]
        }
    } catch (error) {
        console.error("Error during fetch:", error);
    }
    return user;
}
