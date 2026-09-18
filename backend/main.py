from fastapi import FastAPI

app = FastAPI(title="FarmerConnect API")


@app.get("/")
def read_root():
    return {
        "message": "FarmerConnect backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }