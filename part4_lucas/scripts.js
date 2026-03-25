document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const error = document.getElementById('login-error');

    async function loginUser(email, password) {
        const response = await fetch('http://127.0.0.1:5000/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        return response;
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (error) {
                error.textContent = '';
            }

            try {
                const response = await loginUser(email, password);

                if (response.ok) {
                    const data = await response.json();
                    document.cookie = `token=${data.access_token}; path=/`;
                    window.location.href = 'index.html';
                } else {
                    alert('Login failed: ' + response.statusText);
                }
            } catch (err) {
                if (error) {
                    error.textContent = 'Erreur reseau: impossible de joindre le serveur';
                }
            }
        });
    }
});