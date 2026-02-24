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
``` bash
npm install
```
3. Start the development server:
```bash
npm run dev
```
4. Open your browser and navigate to http://localhost:5173


## Docker
1. Build and start
docker-compose up -d

2. View logs
docker-compose logs -f

3. Stop
docker-compose down

4. Rebuild
docker-compose up -d --build
