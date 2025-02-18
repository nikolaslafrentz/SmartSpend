# SmartSpend

A smart budgeting app that helps users manage their money week by week, designed specifically for young people to develop better spending habits.

## Features

- Weekly budget allocation
- Real-time spending notifications
- AI-powered spending insights
- Night Mode for social spending
- Emergency fund access
- Gamification and rewards system

## Tech Stack

- Frontend: Next.js with React
- Backend: Python FastAPI
- Database: PostgreSQL
- Caching: Redis
- ML/AI: Python with scikit-learn

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- Docker and Docker Compose
- PostgreSQL 14+
- Redis 7+

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd smartspend
```

2. Set up the frontend:
```bash
cd frontend
npm install
npm run dev
```

3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. Start the databases:
```bash
docker-compose up -d
```

## Development

- Frontend runs on: http://localhost:3000
- Backend API runs on: http://localhost:8000
- API documentation: http://localhost:8000/docs

## License

[Your chosen license]