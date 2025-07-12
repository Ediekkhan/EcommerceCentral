# E-commerce Application

## Overview

This is a full-stack e-commerce application built with React (frontend) and Express.js (backend). The application provides a modern shopping experience with product browsing, cart management, and integrated Stripe payment processing. It uses a clean, component-based architecture with TypeScript throughout.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks with local state and React Query for server state
- **UI Components**: Radix UI primitives with custom styling via shadcn/ui
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Payment Processing**: Stripe integration
- **Session Management**: Express sessions with PostgreSQL store
- **API Design**: RESTful endpoints with JSON responses

## Key Components

### Frontend Components
- **Product Management**: Product listing, filtering, and individual product views
- **Shopping Cart**: Client-side cart management using localStorage with reactive updates
- **Checkout System**: Multi-step checkout with Stripe payment integration
- **UI Components**: Comprehensive set of reusable UI components (buttons, forms, dialogs, etc.)

### Backend Components
- **Product API**: CRUD operations for products with filtering capabilities
- **Payment Processing**: Stripe payment intent creation and webhook handling
- **Order Management**: Order creation and status tracking
- **Storage Layer**: Abstract storage interface with in-memory implementation for development

## Data Flow

### Product Browsing
1. Frontend fetches products from `/api/products` with optional filters
2. Products are displayed in a grid layout with sorting and filtering options
3. Users can search, filter by category, and sort by various criteria

### Cart Management
1. Cart state is managed client-side using localStorage
2. Cart updates trigger reactive UI updates across components
3. Cart data includes product details, quantities, and calculated totals

### Checkout Process
1. User proceeds to checkout with cart items
2. Shipping information is collected and validated
3. Stripe payment intent is created on the backend
4. Payment is processed securely through Stripe
5. Order is created and stored in the database

## External Dependencies

### Payment Processing
- **Stripe**: Handles secure payment processing
- **Required Environment Variables**:
  - `STRIPE_SECRET_KEY`: Server-side Stripe API key
  - `VITE_STRIPE_PUBLIC_KEY`: Client-side Stripe publishable key

### Database
- **PostgreSQL**: Primary database for persistent data storage
- **Neon Database**: Cloud PostgreSQL service (based on connection string format)
- **Required Environment Variables**:
  - `DATABASE_URL`: PostgreSQL connection string

### Development Tools
- **Replit Integration**: Custom plugins for development environment
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds the React application to `dist/public`
2. **Backend**: esbuild bundles the Express server to `dist/index.js`
3. **Database**: Drizzle handles schema migrations and updates

### Production Configuration
- Static files are served from the Express server
- Environment variables are required for database and Stripe integration
- The application runs as a single Node.js process serving both API and static assets

### Development Workflow
- Hot module replacement for frontend development
- TypeScript compilation and type checking
- Database schema changes through Drizzle migrations
- Integrated error handling and logging

The application follows modern web development practices with clean separation of concerns, type safety throughout, and a scalable architecture that can grow with business needs.