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
                    error.textContent = 'Network error: unable to reach the server';
                }
            }
        });
    }

    if (document.getElementById('places-list')) {
    const token = checkAuthentication();
    fetchPlaces(token);
    }
    const priceFilter = document.getElementById('price-filter');
    if (priceFilter) {
        priceFilter.addEventListener('change', (event) => {
            const selected = event.target.value;
            const cards = document.querySelectorAll('.place-card');
            cards.forEach((card) => {
                const price = Number(card.dataset.price);
                if (selected === 'all' || price <= Number(selected)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    const placeDetails = document.getElementById('place-details');
    if (placeDetails) {
        const placeId = getPlaceIdFromURL();
        const token = checkAuthentication();
        const addReview = document.getElementById('add-review');
        if (!placeId) {
            placeDetails.innerHTML = '<p>Place not found</p>';
            return;
        }
        // Handle Add Review button visibility
        if (addReview) {
            if (!token) {
                addReview.style.display = 'none';
            } else {
                addReview.style.display = 'block';
            }
        }
        fetchPlaceDetails(token, placeId);
    }

    const reviewForm = document.getElementById('review-form');
        const token = checkAuthentication();
        const placeId = getPlaceIdFromURL();

        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault();

                
            });
        }
});

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : null;
}

function getPlaceIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
}

function checkAuthentication(redirectIfNotAuth = false) {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        if (loginLink) {loginLink.style.display = 'inline-flex'};
        if (redirectIfNotAuth) {
            window.location.href = 'index.html';
            return null;
        }
    } else {
        if (loginLink) {loginLink.style.display = 'none'};
    }
    return token;
}

async function fetchPlaces(token) {
    // Make a GET request to fetch places data
    // Include the token in the Authorization header
    // Handle the response and pass the data to displayPlaces function
    try {
        const response = await fetch('http://127.0.0.1:5000/api/v1/places/', {
            method: 'GET',
            headers: token ? { Authorization: 'Bearer ' + token } : {},
        });
        if (response.ok) {
                const places = await response.json();
                displayPlaces(places);
            } else {
                const placesList = document.getElementById('places-list');
                if (placesList) {
                    placesList.innerHTML = '<h2>Available Places</h2><p>Error loading places.</p>';
                }
            }
    } catch (err) {
        const placesList = document.getElementById('places-list');
        if (placesList) {
            placesList.innerHTML = '<h2>Available Places</h2><p>Server unavailable.</p>';
        }
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '<h2>Available Places</h2>';

    places.forEach((place) => {
        const card = document.createElement('article');
        card.className = 'place-card';
        card.dataset.price = place.price;

        card.innerHTML = `
            <h3>${place.title}</h3>
            <p>Price: $${place.price} / night</p>
            <a href="place.html?id=${place.id}" class="action-button">View Details</a>
        `;
        placesList.appendChild(card);
    });
}

async function fetchPlaceDetails(token, placeId) {
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/v1/places/${placeId}`, {
            method: 'GET',
            headers: token ? { Authorization: 'Bearer ' + token } : {},
        })
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            const placeDetails = document.getElementById('place-details');
            if(placeDetails) {
                placeDetails.innerHTML = '<p>Error loading place details.</p>'
            }
        }
    } catch (err) {
        const placeDetails = document.getElementById('place-details');
            if(placeDetails) {
                placeDetails.innerHTML = '<p>Server unavailable.</p>'
            }
    }
}

function displayPlaceDetails(place) {
    const placeDetails = document.getElementById('place-details');
    const reviewsSection = document.getElementById('reviews');
    const addReviewContainer = document.getElementById('add-review');
    if (!placeDetails || !reviewsSection) {
        return;
    }
    let ownerName = 'Unknown Host';
    if (place.owner && place.owner.first_name && place.owner.last_name) {
        ownerName = place.owner.first_name + ' ' + place.owner.last_name;
    }
    let amenitiesText = 'No amenities';
    if (place.amenities && place.amenities.length > 0) {
        amenitiesText = place.amenities.map((a) => a.name).join(', ');
    }
    placeDetails.innerHTML = `
    <h2>${place.title}</h2>
    <div class="place-info">
        <p><strong>Host:</strong> ${ownerName}</p>
        <p><strong>Price:</strong> $${place.price}</p>
        <p><strong>Description:</strong> ${place.description || 'No description'}</p>
        <p><strong>Amenities:</strong> ${amenitiesText}</p>
    </div>
    `;

    while (reviewsSection.firstChild) {
        reviewsSection.removeChild(reviewsSection.firstChild);
    }

    const reviewsTitle = document.createElement('h3');
    reviewsTitle.textContent = 'Reviews';
    reviewsSection.appendChild(reviewsTitle);

    if (!place.reviews || place.reviews.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No reviews yet';
        reviewsSection.appendChild(emptyMessage);

        if (addReviewContainer) {
            reviewsSection.appendChild(addReviewContainer);
        }
        return;
    }
    place.reviews.forEach((review) => {
        const reviewCard = document.createElement('article');
        reviewCard.className = 'review-card';
        let reviewAuthor = 'Unknown User';
        if (review.user && review.user.first_name && review.user.last_name) {
            reviewAuthor = review.user.first_name + ' ' + review.user.last_name;
        }
        reviewCard.innerHTML = `
            <p>${review.comment}</p>
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p><strong>By:</strong> ${reviewAuthor}</p>
        `;
        reviewsSection.appendChild(reviewCard);
    })

    if (addReviewContainer) {
        reviewsSection.appendChild(addReviewContainer);
    }
}