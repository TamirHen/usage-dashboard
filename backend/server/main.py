import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import usage

server = FastAPI()

server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

server.include_router(usage.router)

if __name__ == "__main__":
    uvicorn.run(server, host=settings.host, port=settings.port)
