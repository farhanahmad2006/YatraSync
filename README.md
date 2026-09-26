<div align="center">
  <h1>YatraSync</h1>
  <p><strong>Intelligent Travel Planning & Unified Journey Management Platform</strong></p>
  <p><em>Plan. Connect. Travel.</em></p>
</div>

---

## 🌟 Overview
**YatraSync** is a unified multimodal travel ecosystem connecting travelers, state tourism departments, hotel owners, tour operators, and transport fleets across India with seamless itinerary generation, instant booking, and unified travel passes.

## 🚀 Run Locally

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10+)
- **PostgreSQL** running on `localhost:5432`

### 1. Frontend Setup
```bash
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment:
# Windows: .\venv\Scripts\activate
# Unix/MacOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend API docs available at: `http://127.0.0.1:8000/docs`

---
© 2026 YatraSync. All rights reserved.
