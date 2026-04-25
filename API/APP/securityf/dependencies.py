from fastapi.security import OAuth2PasswordBearer

# auto_error=False: no lanza 401 si falta el header; get_current_user lo gestiona
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token", auto_error=False)
