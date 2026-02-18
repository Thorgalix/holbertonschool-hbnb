from Base_Class import BaseClass

class User(BaseClass):
	def __init__(self, email, first_name, last_name, password, is_admin=False):
		super().__init__()
		self.email = email
		self.first_name = first_name
		self.last_name = last_name
		self.password = password
		self.is_admin = is_admin

		self.places = []
		self.reviews = []
