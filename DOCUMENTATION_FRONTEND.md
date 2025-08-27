# Frontend Documentation

This document provides a detailed overview of the frontend architecture, including component structure, styling, and state management.

## 1. Core Technologies

-   **Framework**: [React](https://reactjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with `postcss`.

## 2. Project Structure (`src/`)

-   `src/main.tsx`: The entry point of the application. It renders the root `App` component.
-   `src/App.tsx`: The root component that sets up routing and global providers.
-   `src/index.css`, `src/App.css`: Global and application-level stylesheets.

### 2.1. Components (`src/components/`)

The application's UI is built from a rich library of components.

-   **UI Primitives (`src/components/ui/`)**: A collection of base UI components, such as `Button`, `Card`, `Input`, etc. These are likely from a library like `shadcn/ui` and provide a consistent look and feel. They are highly reusable and form the building blocks of the UI.
-   **Feature Components (`src/components/`)**: Higher-level components that implement specific application features. Examples include:
    -   `AnimeCard.tsx`: Displays information about an anime.
    -   `PhotoGallery.tsx`: A gallery for displaying photos.
    -   `AIAnniversaryAssistant.tsx`: An AI-powered feature.
-   **Section Components (`src/components/sections/`)**: Large, page-level components that structure the main layout of the application. These compose feature components into meaningful sections like `HeroSection.tsx` and `AboutSection.tsx`.

### 2.2. Pages (`src/pages/`)

-   `src/pages/Index.tsx`: The main page of the application, likely composing the various section components.
-   `src/pages/NotFound.tsx`: The 404 error page.

### 2.3. Hooks (`src/hooks/`)

Custom React hooks are used to encapsulate and reuse stateful logic.
-   `use-device.ts`, `use-mobile.tsx`: Hooks for responsive design, detecting the user's device or screen size.
-   `use-toast.ts`: A hook for displaying toast notifications.
-   `usePerformanceMonitor.ts`: A hook to monitor application performance.

### 2.4. Library/Utilities (`src/lib/`)

Shared code, services, and utility functions.
-   `utils.ts`: A collection of general-purpose utility functions.
-   `ai.ts`, `chatService.ts`: Modules for interacting with AI services.
-   `database.ts`, `supabase.ts`: Modules for database interactions.
-   `color-grading/`: A dedicated module for advanced color grading functionality, with its own engine and services.

## 3. State Management

The application likely uses a combination of React's built-in state management (`useState`, `useContext`) and custom hooks for local and shared state. For more complex, global state, a dedicated library may be used, but it's not explicitly defined in the file structure.

## 4. Styling

-   **Tailwind CSS**: The primary styling engine, configured in `tailwind.config.ts`.
-   **PostCSS**: Used for processing CSS, configured in `postcss.config.js`.
-   **Global Styles**: `src/index.css` contains base styles and Tailwind directives.
-   **Component-Specific Styles**: `src/App.css` and other CSS files may contain styles for specific components.

## 5. Routing

Routing is likely handled by a library such as `react-router-dom`, although it is not explicitly listed as a dependency in the visible file structure. The `src/pages` directory suggests a page-based routing setup.

---

*Next, we will document the backend API in `DOCUMENTATION_BACKEND.md`.*