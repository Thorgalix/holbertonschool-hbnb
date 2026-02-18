from Base_Class import BaseClass

class Amenity(BaseClass):
    def __init__(self, name, description):
        super().__init__()
        self.name = name
        self.description = description
        self.places = []
