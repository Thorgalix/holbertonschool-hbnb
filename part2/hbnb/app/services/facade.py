from app.persistence.repository import InMemoryRepository
from app.models.user import User
from app.models.amenity import Amenity
from app.models.place import Place
class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        '''Gestion USER'''
    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)

    '''Gestion amenity'''
    def create_amenity(self, amenity_data):
        amenity = Amenity(**amenity_data)
        self.amenity_repo.add(amenity)
        return amenity


    def get_amenity(self, amenity_id):
        return self.amenity_repo.get(amenity_id)

    def get_all_amenities(self):
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        return self.amenity_repo.update(amenity_id, amenity_data)
    '''Gestion place'''
    def create_place(self, place_data):
         # 1️⃣ Vérifier doublon
        for place in self.place_repo.get_all():
            if place.title == place_data["title"]:
                raise ValueError("Place already registered")

    # 2️⃣ Vérifier owner
        owner = self.user_repo.get(place_data["owner_id"])
        if not owner:
            raise ValueError("Owner not found")

    # 3️⃣ Vérifier amenities
        amenities = []
        for amenity_id in place_data.get("amenities", []):
            amenity = self.amenity_repo.get(amenity_id)
            if not amenity:
                raise ValueError(f"Amenity {amenity_id} not found")
            amenities.append(amenity)

    # 4️⃣ Créer le Place
        place = Place(
            title=place_data["title"],
            description=place_data.get("description"),
            price=place_data["price"],
            latitude=place_data["latitude"],
            longitude=place_data["longitude"],
            owner=owner,
            amenities=amenities
        )

        self.place_repo.add(place)
        return place


    def get_place(self, place_id):
        return self.place_repo.get(place_id)

    def get_all_places(self):
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        place = self.place_repo.get(place_id)
        if not place:
            return None

        # Update simple fields
        if "title" in place_data:
            place.title = place_data["title"]
        if "description" in place_data:
            place.description = place_data["description"]
        if "price" in place_data:
            place.price = place_data["price"]
        if "latitude" in place_data:
            place.latitude = place_data["latitude"]
        if "longitude" in place_data:
            place.longitude = place_data["longitude"]

        # Update amenities (ajout sans remplacer)
        if "amenities" in place_data:
            for amenity_id in place_data.get("amenities", []):
                amenity = self.amenity_repo.get(amenity_id)
                if not amenity:
                    raise ValueError(f"Amenity {amenity_id} not found")
                if amenity not in place.amenities:
                    place.amenities.append(amenity)
                if place not in amenity.places:
                    amenity.places.append(place)

        place.save()
        return place


