# Project Documentation

This document provides a comprehensive overview of the project's architecture, features, and implementation details.

## Table of Contents

*   [Architecture](#architecture)
*   [Frontend](#frontend)
*   [Backend](#backend)
*   [Features](#features)

## Architecture

Below is a Mermaid diagram illustrating the data flow architecture of the application.

```mermaid
sequenceDiagram
    participant User
    participant ReactComponent as React Component
    participant TanStackQuery as TanStack Query
    participant Supabase
    participant PostgreSQL
    participant AIService as AI Service
    participant GLM4Air as GLM-4-Air

    User->>ReactComponent: Interacts with the UI
    ReactComponent->>ReactComponent: Updates state
    ReactComponent->>TanStackQuery: Manages data synchronization
    TanStackQuery->>Supabase: API Request
    Supabase->>PostgreSQL: Queries the database
    PostgreSQL-->>Supabase: Returns data
    Supabase-->>TanStackQuery: Returns data
    TanStackQuery-->>ReactComponent: Updates data
    ReactComponent-->>User: Renders updated UI

    ReactComponent->>AIService: AI Service Request
    AIService->>GLM4Air: GLM-4-Air API Request
    GLM4Air->>AIService: AI Processing
    AIService-->>ReactComponent: Returns response
    ReactComponent->>User: Integrates AI response into UI
```
