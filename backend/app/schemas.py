from pydantic import BaseModel,Field,ValidationError
from typing import Annotated

EMAIL_REGEX = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
PASSWORD_REGEX=r"^.*(?:\d.*[^a-zA-Z0-9\s]|[^a-zA-Z0-9\s].*\d).*$"

RegexEmail=Annotated[str,Field(pattern=EMAIL_REGEX)]
RegexPassword=Annotated[str,Field(pattern=PASSWORD_REGEX)]

class CreateAccount(BaseModel):
    name:str
    email:RegexEmail
    password:RegexPassword

class LoginAccount(BaseModel):
    email:RegexEmail
    password:RegexPassword
    

    
    
