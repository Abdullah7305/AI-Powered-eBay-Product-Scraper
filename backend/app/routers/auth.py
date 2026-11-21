from app.schemas import CreateAccount,LoginAccount
from fastapi import APIRouter
import logging
authrouter=APIRouter()




logger=logging.getLogger(__name__)


@authrouter.post('/api/v1/user-account')
async def create_account(user_data:CreateAccount):
    user=user_data.model_dump()
    logger.info(user_data)
    return {"message":"Success",**user}



@authrouter.post('/api/v1/user-login')
async def login_account(user_data:LoginAccount):
    user=user_data.model_dump()
    logger.info(user_data)
    return{"message":"Success",**user}