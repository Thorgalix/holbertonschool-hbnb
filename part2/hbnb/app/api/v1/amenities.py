from flask_restx import Namespace, Resource, fields
from app.services import facade

api = Namespace('amenities', description='Amenity operations')

#Define the amenity model for input validation and documentation
amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity'),
    'description': fields.String(description='Description of the amenity')  # facultatif
})

@api.route('/')
class AmenityList(Resource):
    @api.expect(amenity_model)
    @api.response(201, 'Amenity successfully created')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new amenity"""
        amenity_data = api.payload

        # Vérifier doublon par nom
        existing_amenity = next((a for a in facade.get_all_amenities() if a.name == amenity_data['name']), None)
        if existing_amenity:
            return {'error': 'Amenity already exists'}, 400

        # Créer l’amenity
        new_amenity = facade.create_amenity(amenity_data)

        # Retourner l’ID généré + info pour pouvoir l’utiliser dans les places
        return {
            'id': new_amenity.id,
            'name': new_amenity.name,
            'description': getattr(new_amenity, 'description', "")
        }, 201

    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        """Retrieve a list of all amenities"""
        amenity = facade.get_all_amenities()
        return [{'id': a.id, 'name': a.name} for a in amenity], 200

@api.route('/<amenity_id>')
class AmenityResource(Resource):
    @api.response(200, 'Amenity details retrieved successfully')
    @api.response(404, 'Amenity not found')
    def get(self, amenity_id):
        """Get amenity details by ID"""
        amenity = facade.get_amenity(amenity_id)
        if not amenity:
            return {'error': 'Amenity not found'}, 404
        return {'name': amenity.name}, 200

    @api.expect(amenity_model)
    @api.response(200, 'Amenity updated successfully')
    @api.response(404, 'Amenity not found')
    @api.response(400, 'Invalid input data')
    def put(self, amenity_id):
        """Update an amenity's information"""
        amenity  = facade.get_amenity(amenity_id)
        if not amenity:
            return {'error': 'Amenity not found'}, 404
        updated_data = api.payload
        updated_amenity = facade.update_amenity(amenity_id, updated_data)
        return {"message": "Amenity updated successfully"}, 200
