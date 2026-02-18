from Base_Class import BaseClass

class Place(BaseClass):
    def __init__(self, title, description, price, latitude, longitude, owner):
        super().__init__()
        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner = owner      # Relation place/user
        self.reviews = []       # Relations place / review
        self.amenities = []     # Relations place / amenities

        if owner:
            owner.places.append(self)

    def add_review(self, review):
        self.reviews.append(review)

    def add_amenity(self, amenity):
        self.amenities.append(amenity)
        amenity.places.append(self)

    def calculate_rating(self):
        pass
