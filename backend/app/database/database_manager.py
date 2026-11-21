from psycopg_pool import AsyncConnectionPool,PoolTimeout
import psycopg
import logging

logger=logging.getLogger(__name__)
class DatabaseManager:
    def __init__(self,db_url:str) -> None:
          self.is_connected=False
          self.min_connection_count=4
          self.max_connection_count=25
          self.pool=AsyncConnectionPool(
              conninfo=db_url,
              min_size=self.min_connection_count,
              max_size=self.max_connection_count,
              open=False
            )
    
    async def create_connection(self):
        try:
            if self.is_connected:
                logger.warning("Connection Already Open")
                return
            
            await self.pool.open()
            self.is_connected=True
            logging.info("Connection Pool Extablished")
        except PoolTimeout as e:
            logger.critical(f"Timed out waiting for initial DB connections: {e}")
            raise RuntimeError("Database Pool initialization timed out ") from e
        
        except psycopg.OperationalError as e:
            logging.critical(f"Could not connect to PostgreSQL server: {e}")
            raise RuntimeError("Database connection failed. Check credentials or host.") from e
            
        except Exception as e:
            logger.exception("Unexpected error while opening database pool.")
            raise
    
    async def close_connection(self):
        try:
            if not self.is_connected:
                logging.warning("Connection ALready Closed")
                return
            await self.pool.close()
            self.is_connected=False
            logging.info("Connection Pool Closed")
        except psycopg.Error as e:
            logger.error(f"PostgreSQL error while closing pool: {e}")

        except Exception as e:
            logger.exception("Unexpected error while closing database pool.")
            