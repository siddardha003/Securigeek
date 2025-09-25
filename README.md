# Issue Tracker

A modern Issue Tracker application built with **Python FastAPI** backend and **Angular** frontend. This project demonstrates a complete full-stack implementation with REST API, responsive UI, and modern development practices.

## 🚀 Features

### Backend (FastAPI)
- ✅ **Health Check** - GET `/health`
- 📋 **Issues Management**
  - GET `/issues` - List issues with filtering, sorting, and pagination
  - GET `/issues/{id}` - Get single issue details
  - POST `/issues` - Create new issue
  - PUT `/issues/{id}` - Update existing issue
- 🔍 **Advanced Filtering**
  - Search by title
  - Filter by status (open, in_progress, closed)
  - Filter by priority (low, medium, high, critical)
  - Filter by assignee
  - Sort by any column (ascending/descending)
  - Pagination support
- 🔒 **Thread-safe in-memory storage** (easily replaceable with database)
- 📚 **Auto-generated API documentation** (Swagger/OpenAPI)
- 🌐 **CORS enabled** for frontend integration

### Frontend (Angular)
- 📱 **Responsive Material Design** UI
- 📊 **Issues List Page**
  - Interactive data table with sorting
  - Real-time filtering and search
  - Pagination controls
  - Status and priority chips with color coding
- 👀 **Issue Detail Page**
  - Full issue information display
  - Raw JSON view for debugging
  - Navigation breadcrumbs
- ✏️ **Create/Edit Forms**
  - Reactive forms with validation
  - Dropdown selectors for status, priority, assignee
  - Form error handling and user feedback
- 🧭 **Modern Routing**
  - Clean URL structure
  - Guard navigation
  - Page titles

## 🛠️ Tech Stack

### Backend
- **Python 3.8+**
- **FastAPI** - Modern, fast web framework
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI web server

### Frontend
- **Angular 17+** - Modern web application framework
- **Angular Material** - UI component library
- **TypeScript** - Type-safe JavaScript
- **RxJS** - Reactive programming library
- **SCSS** - Enhanced CSS with variables and mixins

## 📋 Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Angular CLI** (optional but recommended): `npm install -g @angular/cli`

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Securigeek
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
python run.py
```

The backend API will be available at: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in new terminal)
cd frontend/issue-tracker-ui

# Install dependencies
npm install

# Start the development server
ng serve
# or
npm start
```

The frontend application will be available at: `http://localhost:4200`

## 📚 API Documentation

### Health Check
```http
GET /health
```
Response: `{"status": "ok"}`

### List Issues
```http
GET /issues?page=1&page_size=10&title=search&status=open&priority=high&assignee=john&sort_by=updated_at&sort_desc=true
```

### Get Single Issue
```http
GET /issues/{id}
```

### Create Issue
```http
POST /issues
Content-Type: application/json

{
  "title": "Issue title",
  "description": "Issue description",
  "status": "open",
  "priority": "medium",
  "assignee": "john.doe"
}
```

### Update Issue
```http
PUT /issues/{id}
Content-Type: application/json

{
  "title": "Updated title",
  "status": "closed"
}
```

## 🏗️ Project Structure

```
Securigeek/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── models/          # Pydantic models
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   └── run.py              # Application entry point
├── frontend/                # Angular frontend
│   └── issue-tracker-ui/
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/  # Angular components
│       │   │   ├── models/      # TypeScript interfaces
│       │   │   ├── services/    # HTTP services
│       │   │   └── app.routes.ts # Routing configuration
│       │   └── styles.scss      # Global styles
│       ├── angular.json         # Angular configuration
│       └── package.json         # Node.js dependencies
└── README.md                # This file
```

## 🎨 Usage Examples

### Creating a New Issue
1. Navigate to `http://localhost:4200`
2. Click "Create New Issue" button
3. Fill in the form fields
4. Click "Create Issue"

### Filtering Issues
1. Use the search box to filter by title
2. Use dropdown filters for status, priority, and assignee
3. Click column headers to sort
4. Use pagination controls at the bottom

### Viewing Issue Details
1. Click on any row in the issues table
2. View complete issue information
3. Click "Edit Issue" to modify
4. Use "Back to List" to return

## 🔧 Development

### Running Tests
```bash
# Backend tests (if implemented)
cd backend
python -m pytest

# Frontend tests
cd frontend/issue-tracker-ui
ng test
```

### Building for Production
```bash
# Backend - run with production ASGI server
cd backend
pip install gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UnicornWorker

# Frontend - build for production
cd frontend/issue-tracker-ui
ng build --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- FastAPI for the excellent Python web framework
- Angular team for the powerful frontend framework
- Material Design for the beautiful UI components

---

**Happy coding! 🚀**