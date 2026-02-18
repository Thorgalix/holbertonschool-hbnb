from Base_Class import Base_Class

class review(Base_Class):
    def __init__(self, rating, comment, user_id, place_id):
        super().__init__()
        self.rating = rating
        self.comment = comment
        self.user_id = user_id
        self.place_id = place_id

    def validate_rating():
        pass

    def get_author():
        pass

    def get_place():
        pass

