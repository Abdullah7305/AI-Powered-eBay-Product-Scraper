from psycopg.errors import UniqueViolation,NotNullViolation,CheckViolation
from app.schemas import  CreateAccount
from psycopg.rows import dict_row
from app.sql.queries import CREATE_USER_TABLE
from abc import ABC,abstractmethod
import logging
import psycopg

logger=logging.getLogger(__name__)


class Repository(ABC):
    def __init__(self):
        pass
    
    @abstractmethod 
    async def execute_command(self,connection:psycopg.AsyncConnection):
        pass

class UserRepository(Repository):
    
    def __init__(self,connection:psycopg.AsyncConnection):
        self.connection=connection
        super().__init__()
        
    async def create_user_table(self):
        try:
            async with self.connection.cursor(row_factory=dict_row) as cur:
                await cur.execute(CREATE_USER_TABLE)
        except psycopg.errors as e:
            logger.warning("Table Error: ",e)
            raise ValueError("Error While Creating Table: ",e)
    
    async def create_user(self, user:CreateAccount):
        try:
            async with self.connection.cursor(row_factory=dict_row) as cur:
                await cur.execute("hshureghrebvy")
                return await cur.fetchone()
        except UniqueViolation as e:
            logger.warning("Error in User Creation: ",e)
            raise ValueError("User Already Exist")
        except psycopg.OperationalError as e:
            logger.warning("Error ",e)
            raise ValueError("Database Connection lost")

        except psycopg.Error as e:
            logger.warning("DB Query Failed ",e)
            raise ValueError("DB Query Failed ",e)
        

            
       

