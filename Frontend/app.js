const API_BASE = "http://127.0.0.1:8000/api";

// ---- View Toggling ----
const navDashboard = document.getElementById('nav-dashboard');
const navInsights = document.getElementById('nav-insights');
const viewDashboard = document.getElementById('dashboard-view');
const viewInsights = document.getElementById('insights-view');

navDashboard.addEventListener('click', (e) => {
    e.preventDefault();
    navDashboard.parentElement.classList.add('active');
    navInsights.parentElement.classList.remove('active');
    viewDashboard.classList.add('active');
    viewInsights.classList.remove('active');
});

navInsights.addEventListener('click', (e) => {
    e.preventDefault();
    navInsights.parentElement.classList.add('active');
    navDashboard.parentElement.classList.remove('active');
    viewInsights.classList.add('active');
    viewDashboard.classList.remove('active');
    triggerAllPredictions();
});

// ---- Dashboard Logic ----
const resourcesContainer = document.getElementById('resources-container');
const statTotal = document.getElementById('stat-total');
const statAvailable = document.getElementById('stat-available');
const modal = document.getElementById('booking-modal');
const closeModal = document.getElementById('close-modal');
const bookingForm = document.getElementById('booking-form');
const bookResourceId = document.getElementById('book-resource-id');
const modalResourceName = document.getElementById('modal-resource-name');

document.addEventListener('DOMContentLoaded', () => {
    loadResources();
    setupInsightListeners();
});

async function loadResources() {
    try {
        const response = await fetch(`${API_BASE}/resources`);
        const resources = await response.json();
        
        statTotal.textContent = resources.length;
        const availableCount = resources.filter(r => r.is_available).length;
        statAvailable.textContent = availableCount;

        resourcesContainer.innerHTML = '';
        resources.forEach(resource => {
            const card = document.createElement('div');
            card.className = 'resource-card';
            
            const statusClass = resource.is_available ? 'status-available' : 'status-booked';
            const statusText = resource.is_available ? 'Available' : 'Booked';
            
            card.innerHTML = `
                <div class="resource-header">
                    <div>
                        <h3 class="resource-title">${resource.name}</h3>
                        <span class="resource-type">${resource.type}</span>
                    </div>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
                <div class="resource-details">
                    <span>📍 ${resource.location}</span>
                    <span>👥 Capacity: ${resource.capacity}</span>
                </div>
                <div class="resource-actions">
                    <button class="btn-primary btn-full ${!resource.is_available ? 'btn-disabled' : ''}" 
                            onclick="openBookingModal(${resource.id}, '${resource.name}')"
                            ${!resource.is_available ? 'disabled' : ''}>
                        ${resource.is_available ? 'Book Now' : 'Currently Unavailable'}
                    </button>
                </div>
            `;
            resourcesContainer.appendChild(card);
        });
    } catch (error) {
        resourcesContainer.innerHTML = '<div class="loading-state">Failed to load resources.</div>';
    }
}

function openBookingModal(id, name) {
    bookResourceId.value = id;
    modalResourceName.textContent = name;
    modal.classList.add('active');
}

closeModal.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });

bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        resource_id: parseInt(bookResourceId.value),
        user_name: document.getElementById('book-name').value,
        start_time: document.getElementById('book-start').value,
        end_time: document.getElementById('book-end').value
    };
    
    try {
        const response = await fetch(`${API_BASE}/book`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if(response.ok) {
            alert("Booking confirmed!");
            modal.classList.remove('active');
            bookingForm.reset();
            loadResources();
        } else {
            const err = await response.json();
            alert("Error: " + err.detail);
        }
    } catch(e) {
        alert("Failed to submit booking.");
    }
});

// ---- Multi-Model AI Insights Logic ----

function setupInsightListeners() {
    // Model A: Room
    const roomInputs = ['temp', 'light', 'sound', 'co2'];
    roomInputs.forEach(id => {
        document.getElementById(`slip-${id}`).addEventListener('input', (e) => {
            document.getElementById(`val-${id}`).textContent = e.target.value;
            fetchRoomPrediction();
        });
    });

    // Model B: Seat
    const seatInputs = ['hour', 'noise'];
    seatInputs.forEach(id => {
        document.getElementById(`slip-${id}`).addEventListener('input', (e) => {
            document.getElementById(`val-${id}`).textContent = e.target.value;
            fetchSeatPrediction();
        });
    });
    document.getElementById('slip-day').addEventListener('change', fetchSeatPrediction);

    // Model C: User
    const userInputs = ['duration', 'books', 'digital', 'logins'];
    userInputs.forEach(id => {
        document.getElementById(`slip-${id}`).addEventListener('input', (e) => {
            document.getElementById(`val-${id}`).textContent = e.target.value;
            fetchUserPrediction();
        });
    });
}

function triggerAllPredictions() {
    fetchRoomPrediction();
    fetchSeatPrediction();
    fetchUserPrediction();
}

async function fetchRoomPrediction() {
    const temp = document.getElementById('slip-temp').value;
    const light = document.getElementById('slip-light').value;
    const sound = document.getElementById('slip-sound').value;
    const co2 = document.getElementById('slip-co2').value;
    
    try {
        const res = await fetch(`${API_BASE}/predict/room?temp=${temp}&light=${light}&sound=${sound}&co2=${co2}`);
        const data = await res.json();
        document.getElementById('res-room').textContent = data.predicted_count;
    } catch(e) {
        document.getElementById('res-room').textContent = "Error";
    }
}

async function fetchSeatPrediction() {
    const hour = document.getElementById('slip-hour').value;
    const day = document.getElementById('slip-day').value;
    const noise = document.getElementById('slip-noise').value;
    
    try {
        const res = await fetch(`${API_BASE}/predict/seat?hour=${hour}&day_of_week=${day}&noise=${noise}`);
        const data = await res.json();
        document.getElementById('res-seat').textContent = data.occupied_probability + "%";
    } catch(e) {
        document.getElementById('res-seat').textContent = "Error";
    }
}

async function fetchUserPrediction() {
    const duration = document.getElementById('slip-duration').value;
    const books = document.getElementById('slip-books').value;
    const digital = document.getElementById('slip-digital').value;
    const logins = document.getElementById('slip-logins').value;
    
    try {
        const res = await fetch(`${API_BASE}/predict/satisfaction?duration=${duration}&books=${books}&digital=${digital}&logins=${logins}`);
        const data = await res.json();
        document.getElementById('res-user').textContent = data.predicted_satisfaction + " / 5";
    } catch(e) {
        document.getElementById('res-user').textContent = "Error";
    }
}
