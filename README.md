# Campus Resource Optimizer (CROptimizer) ✨

CROptimizer is a next-generation, AI-powered Smart Campus Dashboard built for modern university infrastructure. It dynamically tracks, predicts, and manages the occupancy and usage of campus resources (like study rooms, labs, and library seats) using a multi-model machine learning architecture.

## 🚀 Features

- **Real-Time Booking System:** A streamlined, responsive interface that allows students to view and book campus resources in real time via a lightweight SQLite backend.
- **Multi-Model AI Engine:** Our backend utilizes powerful `RandomForest` machine learning algorithms to process disparate datasets and serve three unique AI prediction models simultaneously.
- **Interactive "AI Insights" Dashboard:** A premium, glassmorphism-styled dashboard that allows users and admins to natively adjust environmental and operational parameters via sliders to forecast predictions in real-time.
- **Automated Model Training:** The application natively ingests fresh CSV datasets on a cold start, encoding and training its predictive binary models automatically.

## 🧠 The AI Models

The backend utilizes Three specific datasets from Kaggle to generate predictions:

1. **Room Sensoring Estimation:** Uses `Occupancy_Estimation.csv` to predict the live occupant count in a room based on IoT environmental sensors (Temperature, Light intensity, Sound decibels, CO2 levels).
2. **Library Seat Probability:** Uses `library_seat_occupancy_dataset.csv` to predict the percentage probability that a specific library seat will be occupied based on the Day of the Week, Time of Day, and Ambient Noise.
3. **Student Satisfaction Analytics:** Uses `smart_library_data.csv` to forecast user approval (out of 5) based on their digital footprint, including Visit Duration, Borrowed Books, Digital Resource tracking, and App Logins.

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+). Styled using a futuristic dark-mode glassmorphism aesthetic.
- **Backend:** Python + FastAPI 
- **Database:** SQLite (Zero-configuration)
- **Machine Learning Layer:** Scikit-Learn (RandomForestRegressor & RandomForestClassifier), Pandas, Numpy.

## 💻 How to Run (Local Development)

### 1. Prerequisites
Ensure you have **Python 3.8+** installed on your machine.
Clone this repository to your local computer.

### 2. Install Dependencies
Open a terminal in the `backend/` directory and install the required modules:
```bash
pip install -r requirements.txt
```

### 3. Start the Server
Start the Uvicorn/FastAPI server:
```bash
python -m uvicorn main:app --reload
```
*(Note: If you are running this for the exact first time or if you have added new CSV datasets, it may take 30-45 seconds initially as the AI trains the models from scratch and saves the `.pkl` states.)*

### 4. Open the App
The backend dynamically serves the frontend. Open your web browser and navigate to:
```text
http://127.0.0.1:8000/
```

## 📡 API Reference

The backend exposes a unified REST API for both the resource database and the predictive engines:

- `GET /api/resources` - Fetches the live availability of all campus rooms.
- `POST /api/book` - Updates the database to log a user booking.
- `GET /api/predict/room` - Returns `{ predicted_count }` dependent on `temp`, `light`, `sound`, `co2`.
- `GET /api/predict/seat` - Returns `{ occupied_probability }` dependent on `hour`, `day_of_week`, `noise`.
- `GET /api/predict/satisfaction` - Returns `{ predicted_satisfaction }` dependent on `duration`, `books`, `digital`, `logins`.

## 🤝 Contribution

This project was built for hackathon demonstrations. If you'd like to extend its functionality (such as connecting it to physical IoT hardware or deploying it to AWS/Render), feel free to fork the repository and submit a pull request!
