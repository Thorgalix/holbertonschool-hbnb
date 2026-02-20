from app.models.Base_Class import BaseClass

class Review(BaseClass):
    def __init__(self, rating, comment, user, place):
        super().__init__()
        self.rating = rating
        self.comment = comment
        self.user = user
        self.place = place

        if user:
            user.reviews.append(self)
        if place:
            place.reviews.append(self)

    def validate_rating(self):
        pass
