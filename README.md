# Campus Resource Optimizer (CROptimizer) ✨

**CROptimizer** is a next-generation, AI-powered Smart Campus Dashboard built for modern university infrastructure. It dynamically tracks, predicts, and manages the occupancy and usage of campus resources (study rooms, labs, individual library seats, and physical book inventory) using a multi-model machine learning architecture and a custom **Calculus Optimization Engine**.

## 🚀 Key Modules

### 1. Smart Resource & Seat Booking
- **Room Booking:** Real-time visibility and booking for study rooms, labs, and equipment.
- **Seat Booking:** A dedicated module for individual library study seats, divided into **Quiet**, **Collaborative**, and **Lab** zones.
- **Admin Approval Workflow:** Bookings are submitted as "Pending" and must be approved or rejected by campus staff via a hidden Admin Portal.

### 2. Library Inventory & Calculus Optimizer
- **Book Catalog:** Full library catalog supporting real-time inventory tracking (`total_copies` vs `available_copies`) and waitlist monitoring.
- **Calculus Optimization Engine:** A predictive logic layer that implements the "Calculus Paper" rule:
    - Automatically adjusts book loan periods (14d → 7d → 3d) based on live Demand-Supply ratios.
    - Generates actionable **Acquisition Recommendations** to maintain healthy inventory levels during high-demand periods (e.g., exams).

### 3. Multi-Model AI Insights
- Our backend utilizes `RandomForest` machine learning algorithms across three specific datasets:
    - **Room Sensoring:** Predicts live occupant count based on IoT environmental sensors (Temp, Light, Sound, CO2).
    - **Library Seat Probability:** Forecasts occupied probability based on Time, Day, and Noise.
    - **Satisfaction Analytics:** Predicts user satisfaction based on digital footprint and resource usage.

### 4. Gated Academic Access
- **Student Authentication:** Secure student login gate. Any booking or history search is tied to a verified student identity.
- **Admin Control Panel:** A privileged dashboard for Staff to approve requests, toggle resource availability, and run the Library Optimizer.

---

## 🛠️ Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+). Styled with a futuristic dark-mode glassmorphism aesthetic.
- **Backend:** Python + FastAPI.
- **Database:** SQLite (Relational tracking for Rooms, Seats, Books, and Reservations).
- **Machine Learning:** Scikit-Learn (RandomForest), Pandas, Numpy.

---

## 💻 Get Started

### 1. Prerequisites
- **Python 3.8+**
- (Optional but recommended) Download the [Goodreads books dataset](https://www.kaggle.com/datasets/jealousleopard/goodreadsbooks) from Kaggle, rename it to `books_dataset.csv`, and place it in the `backend/` folder to populate the library with realistic data.

### 2. Installation
Open a terminal in the project directory:
```powershell
pip install -r backend/requirements.txt
```

### 3. Run the Application
```powershell
cd backend
python -m uvicorn main:app --reload
```
Navigate to `http://127.0.0.1:8000/` in your browser.

### 🔑 Test Credentials
| Role | Username | Password |
| :--- | :--- | :--- |
| **Student** | Any Name | `student123` |
| **Admin** | `admin` | `admin123` |

---

## 📡 API Reference

- `GET /api/resources` - Live state of all rooms.
- `GET /api/seats` - Live status of library study seats.
- `GET /api/books` - Full searchable library catalog.
- `POST /api/book` - Request a room booking.
- `POST /api/seats/book` - Request a library seat.
- `GET /api/optimization/library` - Runs the **Calculus Optimizer** algorithm.
- `GET /api/user/{name}/history` - Aggregated history for a specific student.
- `GET /api/admin/requests` - Staff view of all pending academic requests.

---

## 🤝 Contribution

This project was built for hackathon demonstrations. Feel free to extend the AI models or add real IoT sensor integrations!
