# Card Dispute Portal - Capitec Bank

A web application that allows Capitec Bank clients to view their transactions and submit disputes for unauthorized or incorrect charges.

## Features

- **Phone Number + OTP Authentication** - Secure login using phone number and one-time password
- **Transaction Management** - View recent transactions with sorting and pagination
- **Dispute Submission** - Submit disputes with reason codes, descriptions, and evidence attachments
- **Dispute Tracking** - View all submitted disputes with status tracking
- **Responsive Design** - Mobile-friendly interface with collapsible navigation

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vitest** - Unit testing
- **React Testing Library** - Component testing

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Junior-moraba/card-dispute-portal-FE.git
cd card-dispute-portal
```

2. Install dependencies

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to http://localhost:5173

## Development

### Run Development Server
```bash
npm run dev
```
Opens the app at http://localhost:5173

### Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally

## Testing

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Type Checking
```bash
npm run type-check
```

## Code Quality

### Lint Code
```bash
npm run lint
```

### Format Code
```bash
npm run format
```

### Pre-commit Hooks
The project uses Husky for automated code quality checks:
- Linting and formatting on commit
- Running tests on staged files
- Conventional commit message validation

## Docker

### Remove Existing Container (if exists)
```bash
docker rm -f card-dispute-portal
```

### Build and Start
```bash
docker-compose up -d --build
```

### View Logs
```bash
docker-compose logs -f
```

### Stop
```bash
docker-compose down
```

### Rebuild (Clean)
```bash
docker-compose down
docker rm -f card-dispute-portal
docker-compose up -d --build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context providers
├── models/         # TypeScript interfaces
├── pages/          # Page components
├── services/       # API service functions
├── utils/          # Utility functions
└── layouts/        # Layout components
```
