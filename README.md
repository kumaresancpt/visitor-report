# Visitor Report System

A comprehensive reporting, filtering, and export functionality for visitor management.

## Features

- Advanced visitor report filtering and search
- Multiple export formats (PDF, Excel)
- Scheduled reporting
- Real-time data visualization
- Role-based access control
- Email delivery of reports

## Project Structure

- `backend/` - ASP.NET Core 8.0 backend API
- `frontend/` - React + TypeScript frontend

## Setup

### Backend

```bash
cd backend
dotnet restore
dotnet build
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Technologies

- **Backend**: ASP.NET Core 8.0, Entity Framework Core, PostgreSQL
- **Frontend**: React, TypeScript, Vite, Vitest
- **Export**: EPPlus (Excel), iTextSharp (PDF)
- **Email**: MailKit

## License

MIT
