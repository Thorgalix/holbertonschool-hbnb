from app.models.Base_Class import BaseClass

class User(BaseClass):
	def __init__(self, email, first_name, last_name, password, user_id, is_admin=False):
		super().__init__()
		self.email = email
		self.first_name = first_name
		self.last_name = last_name
		self.password = password
		self.is_admin = is_admin
		self.user_id = user_id
		self.places = []
		self.reviews = []

	@property
	def first_name(self):
		return self._first_name
	@first_name.setter
	def first_name(self, value):
		self._first_name = self.validate_attributes_user(value)
	@property
	def last_name(self):
		return self._last_name
	@last_name.setter
	def last_name(self, value):
		self._last_name = self.validate_attributes_user(value)
	@property
	def email(self):
		return self._email_name
	@email.setter
	def email(self, value):
		self._email = self.validate_attributes_user(value)


	def validate_attributes_user(self, first_name, last_name, email):
		try:
			if first_name == "":
				raise ValueError("First_name should be not empty")
			if last_name == "":
				raise ValueError("Last_name should be not empty")
			if email == "":
				raise ValueError("Email should be not empty")
			return True
		except ValueError:
			raise ValueError("Attributes must be not empty")


