import psycopg
from app.database.database import UserRepository
from app.services.jwt_service import generate_token, verify_token

async def user_create_service(user,connection:psycopg.AsyncConnection):
    # user already validated
    # pass the connection to the User Repo to create table and User Data Insertion
    # call the jwt token to create use token
    # return user token and the expiry time and the user data savage clue
    # use try except also
    # call this in upper layer on  create account 
    pass

async def user_login_service(user,connection:psycopg.AsyncConnection):
    pass


async def verify_user_service(token):
    # call the jwt service for verifcation 
    # return true or false for the depedn function usage in upper layer
    # call the verify of the user when the user will send the url link only 
    pass


# call these routing in the router function create the cookies in there as well and the header as well if need and then send response to th server as well 
#validate the user get the HHTP Exception respons if something goes wrong or not ok 
# validate if something got failed the user getthe response or not 
