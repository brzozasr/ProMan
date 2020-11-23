from os import urandom

"""Data to login as postgres administrator."""
PG_DB = ''
PG_USERNAME = ''
PG_PASSWORD = ''

"""Host and port setting for connection to PostgreSQL."""
PG_HOST = ''
PG_PORT = '5432'

"""Session variables"""
SESSION_SECRET_KEY = urandom(64)
SESSION_USER_ID = 'users_id'
SESSION_USER_LOGIN = 'users_login'

"""Local DB"""
# PG_DB = 'pro_man'
# PG_USERNAME = 'postgres'
# PG_PASSWORD = 'brzozasr'
# PG_HOST = 'localhost'
# PG_PORT = '5432'
