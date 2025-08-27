# Core Features Documentation

This document outlines the main features of the application and the technical implementation behind them.

## 1. AI-Powered Features

The application leverages artificial intelligence to provide several advanced features.

### 1.1. AI Chat

-   **Description**: A conversational AI chat interface.
-   **Components**:
    -   `src/components/sections/ChatSection.tsx`: The main UI for the chat.
    -   `src/components/AIInsights.tsx`: A component that likely displays AI-driven insights.
-   **Backend**:
    -   `/api/ai/chat/conversations`: To manage chat sessions.
    -   `/api/ai/chat/messages`: To handle individual messages.
-   **Service**: `src/lib/chatService.ts` encapsulates the logic for communicating with the chat API.

### 1.2. AI Anniversary Assistant

-   **Description**: A feature to help users plan or celebrate anniversaries.
-   **Component**: `src/components/AIAnniversaryAssistant.tsx`.
-   **Functionality**: This component likely interacts with the AI services to provide suggestions, reminders, or other assistance.

## 2. Photo & Media Management

### 2.1. Photo Gallery & Album

-   **Description**: Users can upload, organize, and view photos.
-   **Components**:
    -   `src/components/PhotoUpload.tsx`: The interface for uploading new photos.
    -   `src/components/PhotoGallery.tsx`: Displays a collection of photos.
    -   `src/components/PhotoAlbumManager.tsx`: Allows users to manage albums.
-   **Optimization**: `src/components/ModernImageOptimizer.tsx` and `src/lib/image-optimization.ts` suggest that images are optimized for performance.

### 2.2. Advanced Color Grading

-   **Description**: A sophisticated tool for editing the color of images.
-   **Components**:
    -   `src/components/ColorGradingStudio.tsx`: The main workspace for color grading.
    -   `src/components/AdvancedColorGradingPanel.tsx`: Provides advanced controls.
    -   `src/components/ColorWheel.tsx`, `src/components/PresetManager.tsx`: UI elements for the studio.
-   **Engine**: The `src/lib/color-grading/` directory contains the core logic, including a WebGL-based rendering engine for high-performance image manipulation.

## 3. Interactive & Romantic Features

The application includes many features designed to be interactive and romantic.

-   **Interactive Card (`src/components/InteractiveCard.tsx`)**: A card with interactive elements.
-   **Couple Quiz (`src/components/CoupleQuiz.tsx`)**: A quiz for couples.
-   **Heartbeat Sharing (`src/components/HeartbeatSharing.tsx`)**: A unique feature for sharing a "heartbeat."
-   **Floating Hearts (`src/components/FloatingHearts.tsx`)**, **Sakura Petals (`src/components/SakuraPetals.tsx`)**: Decorative, animated UI elements.

## 4. Content & Journaling

-   **Journaling (`src/components/JournalEntry.tsx`, `src/components/sections/JournalSection.tsx`)**: A feature for writing and saving journal entries.
-   **Rich Text Editor (`src/components/RichTextEditor.tsx`)**: A sophisticated editor for creating formatted text, likely used for journal entries.

## 5. UI & User Experience

-   **Page Transitions (`src/components/PageTransition.tsx`)**: Smooth transitions between pages for a better user experience.
-   **Mobile Optimization (`src/components/MobileOptimized.tsx`)**: Ensures the application is responsive and works well on mobile devices.
-   **Romantic UI Elements**: Custom UI components like `RomanticButton`, `RomanticCard`, and `RomanticInput` create a unique, themed look and feel.

---

*Next, we will document the deployment and operational aspects in `DOCUMENTATION_OPERATIONS.md`.*