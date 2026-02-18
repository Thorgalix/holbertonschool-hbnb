from Base_Class import Base_Class

class User(Base_Class):
	def __init__(self, email, first_name, last_name, password):
		super().__init__()
		self.email = email
		self.first_name = first_name
		self.last_name = last_name
		self.password = password

	def register():
		pass

	def authenticate():
		pass

	def update_profile():
		pass

	def post_places():
		pass

	def post_reviews():
		pass

	def change_password():
		pass
