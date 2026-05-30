# Clothing Store — Frontend

This folder contains:
- UI pages
- Components
- Responsive design details
- Frontend module tracking
- Frontend feature implementation

A React + Vite frontend for a clothing store.

## Tech Stack

- **React** (with Vite)
- **React Router DOM** — client-side routing
- **Lucide React** — icon library
- **Vanilla CSS**

## Prerequisites

Make sure you have the following installed:

- npm (comes with Node.js)

You can verify by running:

```bash
node -v
npm -v
```

## Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone https://github.com/jayagrawal-petabyte/BrainMint_Clothing_Project.git
   cd BrainMint_Clothing_Project
   ```

2. **Navigate to the frontend folder:**

   ```bash
   cd frontend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

   This will install React, Vite, React Router DOM, Lucide React, and all other required packages.

## Running the Dev Server

Start the local development server:

```bash
npm run dev
```

The app will be available at: **http://localhost:5173**

> **Hot Reload:** Any changes you save to `.jsx` or `.css` files will instantly reflect in the browser without a manual refresh.

## Project Structure

```
frontend/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── public/                 # Static assets
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Router setup (Home, Shop)
    ├── App.css             # App-level styles (intentionally empty)
    ├── index.css           # Global reset + Brand design tokens
    ├── data/
    │   └── products.js     # Mock product data (shared across team)
    ├── pages/
    │   ├── Home.jsx        # Homepage placeholder
    │   ├── Shop.jsx        # Shop page (grid + sidebar layout)
    │   └── Shop.css        # Shop page styles
    └── components/
        ├── FilterSidebar.jsx   # Left sidebar filters (collapsible)
        ├── FilterSidebar.css   # Sidebar styles
        ├── Navbar.jsx          # Main navigation bar with dropdowns
        ├── Navbar.css          # Navbar styles
        ├── ProductCard.jsx     # Individual product card
        └── ProductCard.css     # Product card styles
```
## Build for Production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to be deployed.
