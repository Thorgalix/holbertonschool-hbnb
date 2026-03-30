document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const error = document.getElementById('login-error');

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
                    if (error) {
                        error.textContent = 'Authentication failed: invalid email or password';
                    } else {
                        alert('Login failed: ' + response.statusText);
                    }
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
    if (reviewForm) {
        const token = checkAuthentication(true);
        if (!token) return;

        const placeId = getPlaceIdFromURL();
        if (!placeId) {
            alert("Place not found");
            return;
        }
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const text = document.getElementById('review').value.trim();
            const rating = document.getElementById('rating').value;

            if (!text || !rating) {
                alert("Please leave a review and a rating.");
                return;
            }

            const response = await submitReview(token, text, Number(rating), placeId);
            handleResponse(response, reviewForm);
        })
    }
});

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

async function submitReview(token, text, rating, place_id) {
    const response = await fetch ('http://127.0.0.1:5000/api/v1/reviews/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: 'Bearer ' + token } : {}),
        },
        body: JSON.stringify({ text, rating, place_id })
    })
    return response
}

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
        const title = document.createElement('h3')
        const paragraph = document.createElement('p')
        const link = document.createElement('a')
        
        card.className = 'place-card';
        card.dataset.price = place.price;

        title.textContent = place.title
        paragraph.textContent = 'Price: $' + place.price
        link.href = 'place.html?id=' + place.id
        link.className = 'action-button'
        link.textContent = 'View Details'

        card.appendChild(title);
        card.appendChild(paragraph);
        card.appendChild(link);

        placesList.appendChild(card)
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
    const addReviewLink = addReviewContainer ? addReviewContainer.querySelector('a') : null;
    if (!placeDetails) {
        return;
    }
    if (addReviewLink && place.id) {
        addReviewLink.href = `add_review.html?id=${place.id}`;
    }
    let ownerName = 'Unknown Host';
    if (place.owner && place.owner.first_name && place.owner.last_name) {
        ownerName = place.owner.first_name + ' ' + place.owner.last_name;
    }
    let amenitiesText = 'No amenities';
    if (place.amenities && place.amenities.length > 0) {
        amenitiesText = place.amenities.map((a) => a.name).join(', ');
    }

    placeDetails.replaceChildren();

    const titleEl = document.createElement('h2');
    titleEl.textContent = place.title;
    placeDetails.appendChild(titleEl);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'place-info';

    const rows = [
        ['Host', ownerName],
        ['Price', '$' + place.price],
        ['Description', place.description || 'No description'],
        ['Amenities', amenitiesText]
    ];

    rows.forEach(([label, value]) => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');

        strong.textContent = label + ':';
        p.appendChild(strong);
        p.appendChild(document.createTextNode(' ' + String(value)));

        infoDiv.appendChild(p);
    });

    placeDetails.appendChild(infoDiv);

    // On add_review page, we only need place summary, not the reviews list.
    if (!reviewsSection) {
        return;
    }

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

        const commentLine = document.createElement('p');
        commentLine.textContent = review.text || '';

        const ratingLine = document.createElement('p');
        const ratingLabel = document.createElement('strong');
        ratingLabel.textContent = 'Rating:';
        ratingLine.appendChild(ratingLabel);
        ratingLine.appendChild(document.createTextNode(' ' + String(review.rating)));

        const byLine = document.createElement('p');
        const byLabel = document.createElement('strong');
        byLabel.textContent = 'By:';
        byLine.appendChild(byLabel);
        byLine.appendChild(document.createTextNode(' ' + reviewAuthor));

        reviewCard.appendChild(commentLine);
        reviewCard.appendChild(ratingLine);
        reviewCard.appendChild(byLine);
        reviewsSection.appendChild(reviewCard);
    })

    if (addReviewContainer) {
        reviewsSection.appendChild(addReviewContainer);
    }
}

function handleResponse(response, reviewForm) {
    if (response.ok) {
        alert('Review submitted successfully!')
        reviewForm.reset()
    } else {
        alert('Failed to submit review')
    }
}