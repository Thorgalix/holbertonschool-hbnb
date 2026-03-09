from flask_restx import Namespace, Resource, fields
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.services import facade
from flask import request

api = Namespace('users', description='User operations')

# Define the user model for input validation and documentation
user_model = api.model('User', {
    #'user_id': fields.String(required=True, description='ID of the user'),
    'first_name': fields.String(required=True, description='First name of the user'),
    'last_name': fields.String(required=True, description='Last name of the user'),
    'email': fields.String(required=True, description='Email of the user'),
    'password': fields.String(required=True, description='Password of the user')
})

@api.route('/')
class UserList(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new user"""
        try:
            user = facade.create_user(api.payload)
            return {
                "id": user.id,
                "Message": "User successfully created"
            }, 201
        except ValueError as e:
            return {"error": str(e)}, 400

class AdminUserCreate(Resource):
    @jwt_required()
    def post(self):
        current_user = get_jwt()
        if not current_user.get('is_admin'):
            return {'error': 'Admin privileges required'}, 403

        user_data = request.json
        email = user_data.get('email')

        # Check if email is already in use
        if facade.get_user_by_email(email):
            return {'error': 'Email already registered'}, 400

        """Register a new user"""
        try:
            user = facade.create_user(api.payload)
            return {
                "id": user.id,
                "Message": "User successfully created"
            }, 201
        except ValueError as e:
            return {"error": str(e)}, 400


    @api.response(200, 'List users retrieved successfully')
    def get(self):
        """Retrieve a list of all users"""
        users = facade.get_all_users()
        return [{
            'id': a.id,
            'first_name': a.first_name,
            'last_name': a.last_name,
            'email': a.email
            } for a in users], 200

@api.route('/<user_id>')
class UserResource(Resource):
    @api.response(404, 'User not found')
    def get(self, user_id):
        """Get user details by ID"""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404
        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            }, 200

    @api.expect(user_model)
    @api.response(200, 'user updated successfully')
    @api.response(404, 'user not found')
    @api.response(400, 'Invalid input data')
    @jwt_required()
    def put(self, user_id):
        """Update user info (only for the authenticated user, no email/password changes)"""
        current_user_id = get_jwt_identity()  # récupère l'utilisateur connecté
        if user_id != current_user_id:
            return {'error': 'Unauthorized action'}, 403  # utilisateur ne peut pas modifier les autres

        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        updated_data = api.payload

        # Empêche la modification de l'email et du mot de passe
        if 'email' in updated_data or 'password' in updated_data:
            return {'error': 'You cannot modify email or password'}, 400

        try:
            facade.update_user(user_id, updated_data)
        except ValueError as exc:
            return {'error': str(exc)}, 400

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }, 200

class AdminUserModify(Resource):
    @jwt_required()
    def put(self, user_id):
        current_user = get_jwt()
        if not current_user.get('is_admin'):
            return {'error': 'Admin privileges required'}, 403

        data = request.json
        email = data.get('email')

        # Ensure email uniqueness
        if email:
            existing_user = facade.get_user_by_email(email)
            if existing_user and existing_user.id != user_id:
                return {'error': 'Email already in use'}, 400

        # Logic to update user details
        updated_data = api.payload

        # Empêche la modification de l'email et du mot de passe
        if 'email' in updated_data or 'password' in updated_data:
            return {'error': 'You cannot modify email or password'}, 400

        user = facade.get_user(user_id)
        try:
            facade.update_user(user_id, updated_data)
        except ValueError as exc:
            return {'error': str(exc)}, 400

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email
        }, 200

