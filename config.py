from os import urandom

"""Data to login as postgres administrator."""
PG_DB = 'ddcars726gde3l'
PG_USERNAME = 'vwuafnbhaxvliy'
PG_PASSWORD = '78ce242ef9e6dddf4a498ce40b81737dd3182a22d5fda9ed1dd3fb36dd9bfb5e'

"""Host and port setting for connection to PostgreSQL."""
PG_HOST = 'ec2-54-246-67-245.eu-west-1.compute.amazonaws.com'
PG_PORT = '5432'

"""Session variables"""
SESSION_SECRET_KEY = urandom(64)
SESSION_USER_ID = 'user_id'
SESSION_USER_LOGIN = 'user_login'

