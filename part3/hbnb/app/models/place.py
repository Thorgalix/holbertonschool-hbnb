from app.models.Base_Class import BaseClass
from app import db, bcrypt
from sqlalchemy.orm import validates
class Place(BaseClass):
    __tablename__ = 'places'

    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)

    @validates('title')
    def validate_title(self, key, title):
        if title == "":
            raise ValueError("Title should be not empty")
        if len(title) > 50:
            raise ValueError("Title must be maximum 50 characters long")
        return title

    @validates('price')
    def validate_price(self, key, price):
        try:
            price = float(price)
            if price < 0:
                raise ValueError("Price must be non-negative")
            return price
        except (TypeError, ValueError):
            raise ValueError("Price must be a valid number")


    @validates('latitude')
    def validate_latitude(self, key, latitude):
        try:
            latitude = float(latitude)
            if latitude < -90 or latitude > 90:
                raise ValueError("Latitude must be between -90 and 90")
            return latitude
        except (TypeError, ValueError):
            raise ValueError("Latitude must be a valid number between -90 and 90")



    @validates('longitude')
    def validate_longitude(self, key, longitude):
        try:
            longitude = float(longitude)
            if longitude < -180 or longitude > 180:
                raise ValueError("longitude must be between -180 and 180")
            return longitude
        except (TypeError, ValueError):
            raise ValueError("longitude must be a valid number between -180 and 180")

