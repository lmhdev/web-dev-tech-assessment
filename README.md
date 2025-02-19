# Search App

This project is a React application built with Vite and TypeScript. It includes a functional setup with automated testing for quality assurance.

## 🖥 Deployment Link
You can view the live application here: [Search App - Live Demo](https://web-dev-tech-assessment.vercel.app/)

---

## 🚀 Getting Started

Follow these steps to set up, build, and run the application locally.

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- npm (comes with Node.js)

### Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone https://github.com/lmhdev/web-dev-tech-assessment
   cd web-dev-tech-assessment
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the application**:

   ```bash
   npm run dev
   ```

   This will start a local development server. By default, the application will be available at [http://localhost:5173](http://localhost:5173).

4. **Build for production** (optional):

   ```bash
   npm run build
   ```

   The build files will be available in the `dist` directory.

---

## 🧪 Running Automated Tests

This project includes a suite of automated tests to ensure quality and functionality.

### To run all tests:

```bash
npm run test
```

### To run code coverage:

```bash
npm run coverage
```

- The test runner will execute all test files and output the results in the terminal.

### Testing Frameworks:

- [React Testing Library](https://testing-library.com/)
- [Vitest](https://vitest.dev/)

---

## 🔧 Technologies Used

- **Frontend**: React, TypeScript
- **Build Tool**: Vite
- **Testing**: React Testing Library, Vitest

---

## 📂 Project Structure

```
src/
├── components/   # Reusable React components
├── pages/        # Page-level components
├── utils/        # Hooks and helper functions
├── types/        # Types and interfaces
├── assets/       # Static assets (favicon, icons, etc.)
├── App.tsx       # Root application component
└── main.tsx      # Entry point for the application
```

## 📷 Application Screenshots

**Search Bar Suggestions**
![Search Bar Suggestions](./public/search-suggestion.PNG)

**Search Results**
![Search Results](./public/search-result.PNG)

**No Internet Error**
![No internet error](./public/no-internet.PNG)

**Reponsive UI - Search**  
![Reponsive UI - Search](./public/mobile-1.PNG)

**Reponsive UI - Results**  
![Reponsive UI - Results](./public/mobile-2.PNG)

**Unit Tests Results**  
![Unit Tests Results](./public/test-pass.PNG)
