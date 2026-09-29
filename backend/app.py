from fastapi import FastAPI

app = FastAPI(title="SupportMemory AI")


@app.get("/")
def home():
    return {
        "message": "SupportMemory AI backend is running!"
    }
