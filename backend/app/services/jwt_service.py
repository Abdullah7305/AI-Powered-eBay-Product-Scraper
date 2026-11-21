from fastapi import HTTPException,status
from datetime import datetime,timezone,timedelta
import logging
import jwt

secret="vbe343vbe433ke434jhvbo546fdxkbcn2"

logger=logging.getLogger(__name__)


def generate_token(user_id:str,time:datetime):
    try:
        logger.info(f"Token Generated For {user_id}") 
        global secret
        key=secret
        encoded = jwt.encode({"user_id": "user_id","expiry":f"{time}"}, key, algorithm="HS256")
        return encoded
    
    except  jwt.InvalidAlgorithmError as err:
        raise HTTPException(status_code=400,detail="Hashing Algorithm Error")



def verify_token(token:str):
    try:
        global secret
        key=secret
        decoded=jwt.decode(token,key=key,algorithms=["HS256"])
        return decoded
    except jwt.ExpiredSignatureError as err:
            raise HTTPException(status_code=401,detail=f"Token Expired {err}")
        
    except jwt.InvalidTokenError as err:
        raise HTTPException(status_code=401,detail=f"Invalid Token {err}")
  



expire_time = (datetime.now(timezone.utc) + timedelta(minutes=1))


token=generate_token("123",expire_time)
decoded=verify_token(token=token)





    