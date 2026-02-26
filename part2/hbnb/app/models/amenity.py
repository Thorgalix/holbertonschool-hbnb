from app.models.Base_Class import BaseClass

class Amenity(BaseClass):
    def __init__(self, name):
        super().__init__()
        self.name = name
        self.places = []
