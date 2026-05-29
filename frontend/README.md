# Visitor Report Frontend

A React + TypeScript application for managing and viewing visitor reports.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### API Proxy

The development server is configured to proxy API calls to `http://localhost:8000`. Update `vite.config.ts` if the backend URL changes.

### Building for Production

```bash
npm run build
```

### Testing

```bash
npm run test
```

## Features

- **Date Range Filtering**: Select custom date ranges with preset options (Today, This Week, This Month, etc.)
- **Multi-Select Filters**: Filter by Department, Host Employee, Visit Purpose, and Status
- **Report Types**: Full Visitor Log, Pending Approvals, Overstay, Department-wise, Frequent Visitors, Security Incidents
- **Summary Metrics**: View key metrics including total visitors, average duration, denied entries, and more
- **Visitor Details Table**: Sortable table with 12 columns showing complete visitor information
- **Export**: Download reports as PDF or Excel
- **Role-Based Access**: Admin-only access to reports

## Project Structure

```
frontend/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── App.tsx               # Main router component
│   ├── App.css               # App styles
│   ├── index.css             # Global styles
│   ├── types.ts              # TypeScript interfaces
│   ├── pages/
│   │   ├── ReportPage.tsx    # Main report page
│   │   ├── ReportPage.css
│   │   ├── AccessDenied.tsx  # Access denied page
│   │   └── AccessDenied.css
│   ├── components/
│   │   ├── DateRangeFilter.tsx
│   │   ├── DateRangeFilter.css
│   │   ├── MultiSelectFilter.tsx
│   │   ├── MultiSelectFilter.css
│   │   ├── SummaryCard.tsx
│   │   ├── SummaryCard.css
│   │   ├── ReportTable.tsx
│   │   ├── ReportTable.css
│   │   ├── ExportButton.tsx
│   │   └── ExportButton.css
│   └── hooks/
│       ├── useReportData.ts  # Fetch report data and metrics
│       ├── useDateRange.ts   # Date range state management
│       └── useFilters.ts     # Filter state management
├── public/
│   └── logo.svg             # Application logo
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
VITE_API_URL=http://localhost:8000
```

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe development
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **date-fns**: Date utilities
- **CSS 3**: Styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
