from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import database
import model
import os

app = FastAPI(title="Campus Multi-Model AI Dashboard")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    database.create_tables()
    model.train_all_models()

class BookingRequest(BaseModel):
    resource_id: int
    user_name: str
    start_time: str
    end_time: str

@app.get("/api/resources")
def read_resources():
    return database.get_all_resources()

@app.get("/api/resources/{resource_id}")
def read_resource(resource_id: int):
    resource = database.get_resource(resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@app.post("/api/book")
def book_resource(req: BookingRequest):
    resource = database.get_resource(req.resource_id)
    if not resource:
         raise HTTPException(status_code=404, detail="Resource not found")
    if not resource['is_available']:
        raise HTTPException(status_code=400, detail="Resource is currently not available")

    success = database.book_resource(req.resource_id, req.user_name, req.start_time, req.end_time)
    if success:
        return {"message": "Resource booked successfully"}
    else:
        raise HTTPException(status_code=400, detail="Booking failed")

# ----------------------------------------------------
# 3 NEW AI ENDPOINTS
# ----------------------------------------------------

@app.get("/api/predict/room")
def predict_room(temp: float, light: float, sound: float, co2: float):
    count = model.predict_room_occupancy(temp, light, sound, co2)
    return {"predicted_count": round(count, 1)}

@app.get("/api/predict/seat")
def predict_seat(hour: int, day_of_week: str, noise: float):
    prob = model.predict_seat_occupancy(hour, day_of_week, noise)
    return {"occupied_probability": round(prob * 100, 2)}

@app.get("/api/predict/satisfaction")
def predict_satisfaction(duration: float, books: int, digital: float, logins: int):
    score = model.predict_user_satisfaction(duration, books, digital, logins)
    return {"predicted_satisfaction": round(score, 1)}


# Mount frontend
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
os.makedirs(frontend_dir, exist_ok=True)
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
