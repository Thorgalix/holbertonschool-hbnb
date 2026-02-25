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


    @property
    def comment(self):
        return self._comment
    @comment.setter
    def comment(self,value):
        self._comment = self.validate_comment(value)
    @property
    def rating(self):
        return self._rating
    @rating.setter
    def rating(self,value):
        self._rating = self.validate_rating(value)

    def validate_comment(self, comment):
        if comment == "":
            raise ValueError("Comment should be not empty")
        return comment

    def validate_rating(self, rating):
        try:
            rating = int(rating)
            if rating > 5 or rating < 0:
                raise ValueError("Rating must be between 0 and 5")
            return rating
        except (TypeError, ValueError):
            raise ValueError("Rating must be between 0 and 5")