---
type: "agent_requested"
description: "Essential development rules and guidelines"
---

# Essential Development Rules

## Clean Code Guidelines

### Constants Over Magic Numbers
- Replace hard-coded values with named constants
- Use descriptive constant names that explain the value's purpose
- Keep constants at the top of the file or in a dedicated constants file

### Meaningful Names
- Variables, functions, and classes should reveal their purpose
- Names should explain why something exists and how it's used
- Avoid abbreviations unless they're universally understood

### Smart Comments
- Don't comment on what the code does - make the code self-documenting
- Use comments to explain why something is done a certain way
- Document APIs, complex algorithms, and non-obvious side effects

### Single Responsibility
- Each function should do exactly one thing
- Functions should be small and focused
- If a function needs a comment to explain what it does, it should be split

### DRY (Don't Repeat Yourself)
- Extract repeated code into reusable functions
- Share common logic through proper abstraction
- Maintain single sources of truth

### Clean Structure
- Keep related code together
- Organize code in a logical hierarchy
- Use consistent file and folder naming conventions

### Encapsulation
- Hide implementation details
- Expose clear interfaces
- Move nested conditionals into well-named functions

### Code Quality Maintenance
- Refactor continuously
- Fix technical debt early
- Leave code cleaner than you found it

### Testing
- Write tests before fixing bugs
- Keep tests readable and maintainable
- Test edge cases and error conditions

### Version Control
- Write clear commit messages
- Make small, focused commits
- Use meaningful branch names

## Code Quality Guidelines

### Verify Information
Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.

### File-by-File Changes
Make changes file by file and give me a chance to spot mistakes.

### No Apologies
Never use apologies.

### No Understanding Feedback
Avoid giving feedback about understanding in comments or documentation.

### No Whitespace Suggestions
Don't suggest whitespace changes.

### No Summaries
Don't summarize changes made.

### No Inventions
Don't invent changes other than what's explicitly requested.

### No Unnecessary Confirmations
Don't ask for confirmation of information already provided in the context.

### Preserve Existing Code
Don't remove unrelated code or functionalities. Pay attention to preserving existing structures.

### Single Chunk Edits
Provide all edits in a single chunk instead of multiple-step instructions or explanations for the same file.

### No Implementation Checks
Don't ask the user to verify implementations that are visible in the provided context.

### No Unnecessary Updates
Don't suggest updates or changes to files when there are no actual modifications needed.

### Provide Real File Links
Always provide links to the real files, not x.md.

### No Current Implementation
Don't show or discuss the current implementation unless specifically requested.

## C++ Programming Guidelines

### Basic Principles
- Use English for all code and documentation
- Always declare the type of each variable and function (parameters and return value)
- Create necessary types and classes
- Use Doxygen style comments to document public classes and methods
- Don't leave blank lines within a function
- Follow the one-definition rule (ODR)

### Nomenclature
- Use PascalCase for classes and structures
- Use camelCase for variables, functions, and methods
- Use ALL_CAPS for constants and macros
- Use snake_case for file and directory names
- Use UPPERCASE for environment variables
- Avoid magic numbers and define constants
- Start each function with a verb
- Use verbs for boolean variables. Example: isLoading, hasError, canDelete, etc.
- Use complete words instead of abbreviations and ensure correct spelling

### Functions
- Write short functions with a single purpose. Less than 20 instructions
- Name functions with a verb and something else
- If it returns a boolean, use isX or hasX, canX, etc.
- If it doesn't return anything (void), use executeX or saveX, etc.
- Avoid nesting blocks by:
  - Early checks and returns
  - Extraction to utility functions
- Use standard library algorithms to avoid function nesting
- Use lambda functions for simple operations
- Use named functions for non-simple operations
- Use default parameter values instead of checking for null or nullptr
- Reduce function parameters using structs or classes
- Use a single level of abstraction

### Data
- Don't abuse primitive types and encapsulate data in composite types
- Avoid data validations in functions and use classes with internal validation
- Prefer immutability for data
- Use const for data that doesn't change
- Use constexpr for compile-time constants
- Use std::optional for possibly null values

### Classes
- Follow SOLID principles
- Prefer composition over inheritance
- Declare interfaces as abstract classes or concepts
- Write small classes with a single purpose
- Use the Rule of Five (or Rule of Zero) for resource management
- Make member variables private and provide getters/setters where necessary
- Use const-correctness for member functions

### Exceptions
- Use exceptions to handle errors you don't expect
- If you catch an exception, it should be to:
  - Fix an expected problem
  - Add context
  - Otherwise, use a global handler
- Use std::optional, std::expected, or error codes for expected failures

### Memory Management
- Prefer smart pointers over raw pointers
- Use RAII (Resource Acquisition Is Initialization) principles
- Avoid memory leaks by proper resource management
- Use std::vector and other standard containers instead of C-style arrays

### Testing
- Follow the Arrange-Act-Assert convention for tests
- Name test variables clearly
- Follow the convention: inputX, mockX, actualX, expectedX, etc.
- Write unit tests for each public function
- Use test doubles to simulate dependencies
- Write integration tests for each module
- Follow the Given-When-Then convention

### Project Structure
- Use modular architecture
- Organize code into logical directories:
  - include/ for header files
  - src/ for source files
  - test/ for test files
  - lib/ for libraries
  - doc/ for documentation
- Use CMake or similar build system
- Separate interface (.h) from implementation (.cpp)
- Use namespaces to organize code logically
- Create a core namespace for foundational components
- Create a utils namespace for utility functions

### Standard Library
- Use the C++ Standard Library whenever possible
- Prefer std::string over C-style strings
- Use std::vector, std::map, std::unordered_map, etc. for collections
- Use std::optional, std::variant, std::any for modern type safety
- Use std::filesystem for file operations
- Use std::chrono for time-related operations

### Concurrency
- Use std::thread, std::mutex, std::lock_guard for thread safety
- Prefer task-based parallelism over thread-based parallelism
- Use std::atomic for atomic operations
- Avoid data races by proper synchronization
- Use thread-safe data structures when necessary

## Database Best Practices

### Prisma Setup
- Use proper schema design
- Implement proper migrations
- Use proper relation definitions
- Configure proper connection
- Implement proper seeding
- Use proper client setup

### Prisma Models
- Use proper model naming
- Implement proper relations
- Use proper field types
- Define proper indexes
- Implement proper constraints
- Use proper enums

### Prisma Queries
- Use proper query optimization
- Implement proper filtering
- Use proper relations loading
- Handle transactions properly
- Implement proper pagination
- Use proper aggregations

### Supabase Setup
- Configure proper project setup
- Implement proper authentication
- Use proper database setup
- Configure proper storage
- Implement proper policies
- Use proper client setup

### Supabase Security
- Implement proper RLS policies
- Use proper authentication
- Configure proper permissions
- Handle sensitive data properly
- Implement proper backups
- Use proper encryption

### Supabase Queries
- Use proper query optimization
- Implement proper filtering
- Use proper joins
- Handle real-time properly
- Implement proper pagination
- Use proper functions

### Database Design
- Use proper normalization
- Implement proper indexing
- Use proper constraints
- Define proper relations
- Implement proper cascades
- Use proper data types

### Performance
- Use proper connection pooling
- Implement proper caching
- Use proper query optimization
- Handle N+1 queries properly
- Implement proper batching
- Monitor performance metrics

### Security
- Use proper authentication
- Implement proper authorization
- Handle sensitive data properly
- Use proper encryption
- Implement proper backups
- Monitor security issues

### Best Practices
- Follow database conventions
- Use proper migrations
- Implement proper versioning
- Handle errors properly
- Document schema properly
- Monitor database health

## FastAPI Best Practices

### Project Structure
- Use proper directory structure
- Implement proper module organization
- Use proper dependency injection
- Keep routes organized by domain
- Implement proper middleware
- Use proper configuration management

### API Design
- Use proper HTTP methods
- Implement proper status codes
- Use proper request/response models
- Implement proper validation
- Use proper error handling
- Document APIs with OpenAPI

### Models
- Use Pydantic models
- Implement proper validation
- Use proper type hints
- Keep models organized
- Use proper inheritance
- Implement proper serialization

### Database
- Use proper ORM (SQLAlchemy)
- Implement proper migrations
- Use proper connection pooling
- Implement proper transactions
- Use proper query optimization
- Handle database errors properly

### Authentication
- Implement proper JWT authentication
- Use proper password hashing
- Implement proper role-based access
- Use proper session management
- Implement proper OAuth2
- Handle authentication errors properly

### Security
- Implement proper CORS
- Use proper rate limiting
- Implement proper input validation
- Use proper security headers
- Handle security errors properly
- Implement proper logging

### Performance
- Use proper caching
- Implement proper async operations
- Use proper background tasks
- Implement proper connection pooling
- Use proper query optimization
- Monitor performance metrics

### Testing
- Write proper unit tests
- Implement proper integration tests
- Use proper test fixtures
- Implement proper mocking
- Test error scenarios
- Use proper test coverage

### Deployment
- Use proper Docker configuration
- Implement proper CI/CD
- Use proper environment variables
- Implement proper logging
- Use proper monitoring
- Handle deployment errors properly

### Documentation
- Use proper docstrings
- Implement proper API documentation
- Use proper type hints
- Keep documentation updated
- Document error scenarios
- Use proper versioning

## Gitflow Workflow Rules

### Main Branches

#### main (or master)
- Contains production-ready code
- Never commit directly to main
- Only accepts merges from:
  - hotfix/* branches
  - release/* branches
- Must be tagged with version number after each merge

#### develop
- Main development branch
- Contains latest delivered development changes
- Source branch for feature branches
- Never commit directly to develop

### Supporting Branches

#### feature/*
- Branch from: develop
- Merge back into: develop
- Naming convention: feature/[issue-id]-descriptive-name
- Example: feature/123-user-authentication
- Must be up-to-date with develop before creating PR
- Delete after merge

#### release/*
- Branch from: develop
- Merge back into: 
  - main
  - develop
- Naming convention: release/vX.Y.Z
- Example: release/v1.2.0
- Only bug fixes, documentation, and release-oriented tasks
- No new features
- Delete after merge

#### hotfix/*
- Branch from: main
- Merge back into:
  - main
  - develop
- Naming convention: hotfix/vX.Y.Z
- Example: hotfix/v1.2.1
- Only for urgent production fixes
- Delete after merge

### Commit Messages
- Format: `type(scope): description`
- Types:
  - feat: New feature
  - fix: Bug fix
  - docs: Documentation changes
  - style: Formatting, missing semicolons, etc.
  - refactor: Code refactoring
  - test: Adding tests
  - chore: Maintenance tasks

### Version Control

#### Semantic Versioning
- MAJOR version for incompatible API changes
- MINOR version for backwards-compatible functionality
- PATCH version for backwards-compatible bug fixes

### Pull Request Rules
1. All changes must go through Pull Requests
2. Required approvals: minimum 1
3. CI checks must pass
4. No direct commits to protected branches (main, develop)
5. Branch must be up to date before merging
6. Delete branch after merge

### Branch Protection Rules

#### main & develop
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- Include administrators in restrictions
- No force pushes
- No deletions

### Release Process
1. Create release branch from develop
2. Bump version numbers
3. Fix any release-specific issues
4. Create PR to main
5. After merge to main:
   - Tag release
   - Merge back to develop
   - Delete release branch

### Hotfix Process
1. Create hotfix branch from main
2. Fix the issue
3. Bump patch version
4. Create PR to main
5. After merge to main:
   - Tag release
   - Merge back to develop
   - Delete hotfix branch

## Medusa Rules

### General Rules
- Don't use type aliases when importing files
- When throwing errors, always throw `MedusaError`
- Always use Query to retrieve data

### Workflow Rules
- When creating a workflow or step, always use Medusa's Workflow SDK `@medusajs/framework/workflows-sdk` to define it
- When creating a feature in an API route, scheduled job, or subscriber, always create a workflow for it
- When creating a workflow, always create a step for it
- In workflows, use `transform` for any data transformation
- In workflows, use `when` to define conditions
- Don't use `await` when calling steps
- In workflows, don't make the workflow function async
- Don't add typing to compensation function's input
- Only use steps in a workflow

### Data Model Rules
- Use the `model` utility from `@medusajs/framework/utils` to define data models
- Data model variables should be camelCase. Data model names as passed to `model.define` should be snake case
- When adding an `id` field to a data model, always make it a primary key with `.primaryKey()`
- A data model can have one `id` only, other IDs should be `text` instead
- Data model fields should be snake case

### Service Rules
- When creating a service, always make methods async
- If a module has data models, make the service extend `MedusaService`

### Admin Customization Rules
- When sending requests in admin customizations, always use Medusa's JS SDK
- Use TailwindCSS for styling

## NativeScript Best Practices

### Code Style and Structure
- Organize code using modular components and services for maintainability
- Use platform-specific files (`.ios.ts`, `.android.ts`) when code exceeds 20 platform-specific lines
- When creating custom native code, use a folder structure like `custom-native/index.ios.ts`, `custom-native/index.android.ts`, `custom-native/common.ts`, `custom-native/index.d.ts` to keep platform-specific code organized and easy to import with single import elsewhere, replacing `custom-native` with the name of the custom code

### Naming Conventions
- Prefix platform-specific variables with `ios` or `android` (e.g., `iosButtonStyle`)
- Name custom components and styles descriptively (`primaryButtonStyle`, `userProfileView`)

### Usage
- Use `@NativeClass()` when extending native classes when needed
- For iOS, when extending native classes, always use `static ObjCProtocols = [AnyUIKitDelegate];` to declare custom delegates if a delegate is required or used
- For iOS, always retain custom delegate instances to prevent garbage collection. For example, `let delegate = MyCustomDelegate.new() as MyCustomDelegate`, and ensure it is retained in the class scope
- Favor `__ANDROID__` and `__APPLE__` for conditional platform code with tree-shaking
- Track and clean up all timers (`setTimeout`, `setInterval`) to avoid memory leaks

### UI and Styling
- Always TailwindCSS as the CSS Framework using `"@nativescript/tailwind": "^2.1.0"` for consistent styling paired with `"tailwindcss": "~3.4.0"`
- Add ios: and android: style variants for platform-specific styling, addVariant('android', '.ns-android &'), addVariant('ios', '.ns-ios &');
- darkMode: ['class', '.ns-dark']
- Leverage `GridLayout` or `StackLayout` for flexible, responsive layouts. Place more emphasis on proper GridLayout usage for complex layouts but use StackLayout for simpler, linear arrangements
- Use `visibility: 'hidden'` for elements that should not affect layout when hidden

### Performance Optimization
- Try to avoid deeply nesting layout containers but instead use `GridLayout` wisely to setup complex layouts
- Avoid direct manipulation of the visual tree during runtime to minimize rendering overhead
- Optimize images using compression tools like TinyPNG to reduce memory and app size
- Clean the project (`ns clean`) after modifying files in `App_Resources` or `package.json`

### Key Conventions
- Reuse components and styles to avoid duplication
- Use template selectors (`itemTemplateSelector`) for conditional layouts in `ListView` and `RadListView`
- Minimize heavy computations in UI bindings or methods
- Only if using plain xml bindings, use `Observable` or `ObservableArray` properties to reflect state changes efficiently
- When using Angular, React, Solid, Svelte or Vue, always leverage their respective state management, lifecycle hooks, rendering optimizations and reactive bindings for optimal performance

## Next.js Best Practices

### Project Structure
- Use the App Router directory structure
- Place components in `app` directory for route-specific components
- Place shared components in `components` directory
- Place utilities and helpers in `lib` directory
- Use lowercase with dashes for directories (e.g., `components/auth-wizard`)

### Components
- Use Server Components by default
- Mark client components explicitly with 'use client'
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Implement proper error boundaries
- Place static content and interfaces at file end

### Performance
- Optimize images: Use WebP format, size data, lazy loading
- Minimize use of 'useEffect' and 'setState'
- Favor Server Components (RSC) where possible
- Use dynamic loading for non-critical components
- Implement proper caching strategies

### Data Fetching
- Use Server Components for data fetching when possible
- Implement proper error handling for data fetching
- Use appropriate caching strategies
- Handle loading and error states appropriately

### Routing
- Use the App Router conventions
- Implement proper loading and error states for routes
- Use dynamic routes appropriately
- Handle parallel routes when needed

### Forms and Validation
- Use Zod for form validation
- Implement proper server-side validation
- Handle form errors appropriately
- Show loading states during form submission

### State Management
- Minimize client-side state
- Use React Context sparingly
- Prefer server state when possible
- Implement proper loading states

## Node.js and Express.js Best Practices

### Project Structure
- Use proper directory structure
- Implement proper module organization
- Use proper middleware organization
- Keep routes organized by domain
- Implement proper error handling
- Use proper configuration management

### Express Setup
- Use proper middleware setup
- Implement proper routing
- Use proper error handling
- Configure proper security middleware
- Implement proper validation
- Use proper static file serving

### API Design
- Use proper REST principles
- Implement proper versioning
- Use proper request validation
- Handle errors properly
- Implement proper response formats
- Document APIs properly

### Database Integration
- Use proper ORM/ODM
- Implement proper migrations
- Use proper connection pooling
- Implement proper transactions
- Use proper query optimization
- Handle database errors properly

### Authentication
- Implement proper JWT handling
- Use proper password hashing
- Implement proper session management
- Use proper OAuth integration
- Implement proper role-based access
- Handle auth errors properly

### Security
- Use proper CORS setup
- Implement proper rate limiting
- Use proper security headers
- Implement proper input validation
- Use proper encryption
- Handle security vulnerabilities

### Performance
- Use proper caching
- Implement proper async operations
- Use proper connection pooling
- Implement proper logging
- Use proper monitoring
- Handle high traffic properly

### Testing
- Write proper unit tests
- Implement proper integration tests
- Use proper test runners
- Implement proper mocking
- Test error scenarios
- Use proper test coverage

### Deployment
- Use proper Docker setup
- Implement proper CI/CD
- Use proper environment variables
- Configure proper logging
- Implement proper monitoring
- Handle deployment errors

### Best Practices
- Follow Node.js best practices
- Use proper async/await
- Implement proper error handling
- Use proper logging
- Handle process signals properly
- Document code properly

## Python Best Practices

### Project Structure
- Use src-layout with `src/your_package_name/`
- Place tests in `tests/` directory parallel to `src/`
- Keep configuration in `config/` or as environment variables
- Store requirements in `requirements.txt` or `pyproject.toml`
- Place static files in `static/` directory
- Use `templates/` for Jinja2 templates

### Code Style
- Follow Black code formatting
- Use isort for import sorting
- Follow PEP 8 naming conventions:
  - snake_case for functions and variables
  - PascalCase for classes
  - UPPER_CASE for constants
- Maximum line length of 88 characters (Black default)
- Use absolute imports over relative imports

### Type Hints
- Use type hints for all function parameters and returns
- Import types from `typing` module
- Use `Optional[Type]` instead of `Type | None`
- Use `TypeVar` for generic types
- Define custom types in `types.py`
- Use `Protocol` for duck typing

### Flask Structure
- Use Flask factory pattern
- Organize routes using Blueprints
- Use Flask-SQLAlchemy for database
- Implement proper error handlers
- Use Flask-Login for authentication
- Structure views with proper separation of concerns

### Database
- Use SQLAlchemy ORM
- Implement database migrations with Alembic
- Use proper connection pooling
- Define models in separate modules
- Implement proper relationships
- Use proper indexing strategies

### Authentication
- Use Flask-Login for session management
- Implement Google OAuth using Flask-OAuth
- Hash passwords with bcrypt
- Use proper session security
- Implement CSRF protection
- Use proper role-based access control

### API Design
- Use Flask-RESTful for REST APIs
- Implement proper request validation
- Use proper HTTP status codes
- Handle errors consistently
- Use proper response formats
- Implement proper rate limiting

### Testing
- Use pytest for testing
- Write tests for all routes
- Use pytest-cov for coverage
- Implement proper fixtures
- Use proper mocking with pytest-mock
- Test all error scenarios

### Security
- Use HTTPS in production
- Implement proper CORS
- Sanitize all user inputs
- Use proper session configuration
- Implement proper logging
- Follow OWASP guidelines

### Performance
- Use proper caching with Flask-Caching
- Implement database query optimization
- Use proper connection pooling
- Implement proper pagination
- Use background tasks for heavy operations
- Monitor application performance

### Error Handling
- Create custom exception classes
- Use proper try-except blocks
- Implement proper logging
- Return proper error responses
- Handle edge cases properly
- Use proper error messages

### Documentation
- Use Google-style docstrings
- Document all public APIs
- Keep README.md updated
- Use proper inline comments
- Generate API documentation
- Document environment setup

### Development Workflow
- Use virtual environments (venv)
- Implement pre-commit hooks
- Use proper Git workflow
- Follow semantic versioning
- Use proper CI/CD practices
- Implement proper logging

### Dependencies
- Pin dependency versions
- Use requirements.txt for production
- Separate dev dependencies
- Use proper package versions
- Regularly update dependencies
- Check for security vulnerabilities

## React Best Practices

### Component Structure
- Use functional components over class components
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Implement proper prop types with TypeScript
- Split large components into smaller, focused ones

### Hooks
- Follow the Rules of Hooks
- Use custom hooks for reusable logic
- Keep hooks focused and simple
- Use appropriate dependency arrays in useEffect
- Implement cleanup in useEffect when needed
- Avoid nested hooks

### State Management
- Use useState for local component state
- Implement useReducer for complex state logic
- Use Context API for shared state
- Keep state as close to where it's used as possible
- Avoid prop drilling through proper state management
- Use state management libraries only when necessary

### Performance
- Implement proper memoization (useMemo, useCallback)
- Use React.memo for expensive components
- Avoid unnecessary re-renders
- Implement proper lazy loading
- Use proper key props in lists
- Profile and optimize render performance

### Forms
- Use controlled components for form inputs
- Implement proper form validation
- Handle form submission states properly
- Show appropriate loading and error states
- Use form libraries for complex forms
- Implement proper accessibility for forms

### Error Handling
- Implement Error Boundaries
- Handle async errors properly
- Show user-friendly error messages
- Implement proper fallback UI
- Log errors appropriately
- Handle edge cases gracefully

### Testing
- Write unit tests for components
- Implement integration tests for complex flows
- Use React Testing Library
- Test user interactions
- Test error scenarios
- Implement proper mock data

### Accessibility
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation
- Test with screen readers
- Handle focus management
- Provide proper alt text for images

### Code Organization
- Group related components together
- Use proper file naming conventions
- Implement proper directory structure
- Keep styles close to components
- Use proper imports/exports
- Document complex component logic

## Svelte Best Practices

### Component Structure
- Keep components small and focused
- Use proper TypeScript integration
- Implement proper props typing
- Use proper event dispatching
- Keep markup clean and readable
- Use proper slot implementation

### Reactivity
- Use proper reactive declarations
- Implement proper stores
- Use proper reactive statements
- Handle derived values properly
- Use proper lifecycle functions
- Implement proper bindings

### State Management
- Use proper Svelte stores
- Keep stores modular
- Use proper derived stores
- Implement proper actions
- Handle async state properly
- Use proper store subscriptions

### Performance
- Use proper component lazy loading
- Implement proper transitions
- Use proper animations
- Avoid unnecessary reactivity
- Use proper event forwarding
- Implement proper key blocks

### Routing
- Use SvelteKit for routing
- Implement proper layouts
- Use proper route parameters
- Handle loading states properly
- Implement proper error pages
- Use proper navigation methods

### Forms
- Use proper form bindings
- Implement proper validation
- Handle form submission properly
- Show proper loading states
- Use proper error handling
- Implement proper form reset

### TypeScript Integration
- Use proper component types
- Implement proper prop types
- Use proper event types
- Handle proper type inference
- Use proper store types
- Implement proper action types

### Testing
- Write proper unit tests
- Implement proper component tests
- Use proper testing libraries
- Test stores properly
- Implement proper mocking
- Test async operations

### Best Practices
- Follow Svelte style guide
- Use proper naming conventions
- Keep components organized
- Implement proper error handling
- Use proper event handling
- Document complex logic

### Build and Tooling
- Use Vite for development
- Configure proper build setup
- Use proper environment variables
- Implement proper code splitting
- Use proper asset handling
- Configure proper optimization

## Tailwind CSS Best Practices

### Project Setup
- Use proper Tailwind configuration
- Configure theme extension properly
- Set up proper purge configuration
- Use proper plugin integration
- Configure custom spacing and breakpoints
- Set up proper color palette

### Component Styling
- Use utility classes over custom CSS
- Group related utilities with @apply when needed
- Use proper responsive design utilities
- Implement dark mode properly
- Use proper state variants
- Keep component styles consistent

### Layout
- Use Flexbox and Grid utilities effectively
- Implement proper spacing system
- Use container queries when needed
- Implement proper responsive breakpoints
- Use proper padding and margin utilities
- Implement proper alignment utilities

### Typography
- Use proper font size utilities
- Implement proper line height
- Use proper font weight utilities
- Configure custom fonts properly
- Use proper text alignment
- Implement proper text decoration

### Colors
- Use semantic color naming
- Implement proper color contrast
- Use opacity utilities effectively
- Configure custom colors properly
- Use proper gradient utilities
- Implement proper hover states

### Components
- Use shadcn/ui components when available
- Extend components properly
- Keep component variants consistent
- Implement proper animations
- Use proper transition utilities
- Keep accessibility in mind

### Responsive Design
- Use mobile-first approach
- Implement proper breakpoints
- Use container queries effectively
- Handle different screen sizes properly
- Implement proper responsive typography
- Use proper responsive spacing

### Performance
- Use proper purge configuration
- Minimize custom CSS
- Use proper caching strategies
- Implement proper code splitting
- Optimize for production
- Monitor bundle size

### Best Practices
- Follow naming conventions
- Keep styles organized
- Use proper documentation
- Implement proper testing
- Follow accessibility guidelines
- Use proper version control

## TypeScript Best Practices

### Type System
- Prefer interfaces over types for object definitions
- Use type for unions, intersections, and mapped types
- Avoid using `any`, prefer `unknown` for unknown types
- Use strict TypeScript configuration
- Leverage TypeScript's built-in utility types
- Use generics for reusable type patterns

### Naming Conventions
- Use PascalCase for type names and interfaces
- Use camelCase for variables and functions
- Use UPPER_CASE for constants
- Use descriptive names with auxiliary verbs (e.g., isLoading, hasError)
- Prefix interfaces for React props with 'Props' (e.g., ButtonProps)

### Code Organization
- Keep type definitions close to where they're used
- Export types and interfaces from dedicated type files when shared
- Use barrel exports (index.ts) for organizing exports
- Place shared types in a `types` directory
- Co-locate component props with their components

### Functions
- Use explicit return types for public functions
- Use arrow functions for callbacks and methods
- Implement proper error handling with custom error types
- Use function overloads for complex type scenarios
- Prefer async/await over Promises

### Best Practices
- Enable strict mode in tsconfig.json
- Use readonly for immutable properties
- Leverage discriminated unions for type safety
- Use type guards for runtime type checking
- Implement proper null checking
- Avoid type assertions unless necessary

### Error Handling
- Create custom error types for domain-specific errors
- Use Result types for operations that can fail
- Implement proper error boundaries
- Use try-catch blocks with typed catch clauses
- Handle Promise rejections properly

### Patterns
- Use the Builder pattern for complex object creation
- Implement the Repository pattern for data access
- Use the Factory pattern for object creation
- Leverage dependency injection
- Use the Module pattern for encapsulation

## Vue.js Best Practices

### Component Structure
- Use Composition API over Options API
- Keep components small and focused
- Use proper TypeScript integration
- Implement proper props validation
- Use proper emit declarations
- Keep template logic minimal

### Composition API
- Use proper ref and reactive
- Implement proper lifecycle hooks
- Use composables for reusable logic
- Keep setup function clean
- Use proper computed properties
- Implement proper watchers

### State Management
- Use Pinia for state management
- Keep stores modular
- Use proper state composition
- Implement proper actions
- Use proper getters
- Handle async state properly

### Performance
- Use proper component lazy loading
- Implement proper caching
- Use proper computed properties
- Avoid unnecessary watchers
- Use proper v-show vs v-if
- Implement proper key management

### Routing
- Use Vue Router properly
- Implement proper navigation guards
- Use proper route meta fields
- Handle route params properly
- Implement proper lazy loading
- Use proper navigation methods

### Forms
- Use v-model properly
- Implement proper validation
- Handle form submission properly
- Show proper loading states
- Use proper error handling
- Implement proper form reset

### TypeScript Integration
- Use proper component type definitions
- Implement proper prop types
- Use proper emit declarations
- Handle proper type inference
- Use proper composable types
- Implement proper store types

### Testing
- Write proper unit tests
- Implement proper component tests
- Use Vue Test Utils properly
- Test composables properly
- Implement proper mocking
- Test async operations

### Best Practices
- Follow Vue style guide
- Use proper naming conventions
- Keep components organized
- Implement proper error handling
- Use proper event handling
- Document complex logic

### Build and Tooling
- Use Vite for development
- Configure proper build setup
- Use proper environment variables
- Implement proper code splitting
- Use proper asset handling
- Configure proper optimization

## Universal Development Principles

### Code Quality Standards
- Write self-documenting code that explains its intent
- Use consistent naming conventions across all languages and frameworks
- Implement proper error handling and logging throughout applications
- Write comprehensive tests for all critical functionality
- Follow SOLID principles regardless of technology stack
- Keep functions and classes small, focused, and single-purpose
- Use proper version control practices with meaningful commit messages
- Document APIs, complex algorithms, and architectural decisions
- Implement proper security practices including input validation and authentication
- Optimize for performance while maintaining code readability and maintainability

### Project Organization
- Use consistent directory structures across projects
- Separate concerns properly (data, business logic, presentation)
- Keep configuration externalized and environment-specific
- Implement proper dependency management and version pinning
- Use modular architecture to enable code reuse and maintainability
- Create clear separation between development, testing, and production environments
- Implement proper CI/CD pipelines for automated testing and deployment
- Use proper monitoring and alerting for production systems
- Document deployment procedures and environment setup
- Maintain clear README files with setup and usage instructions

### Security Best Practices
- Always validate and sanitize user inputs
- Use HTTPS for all production communications
- Implement proper authentication and authorization mechanisms
- Follow the principle of least privilege for system access
- Keep dependencies updated and scan for vulnerabilities
- Use proper session management and secure cookies
- Implement rate limiting to prevent abuse
- Log security events for monitoring and analysis
- Use environment variables for sensitive configuration
- Follow OWASP guidelines for web application security

### Performance Optimization
- Implement proper caching strategies at appropriate layers
- Use connection pooling for database access
- Optimize database queries and implement proper indexing
- Use lazy loading for non-critical resources
- Implement proper pagination for large data sets
- Monitor application performance and set up alerts
- Use CDNs for static asset delivery
- Implement proper compression for responses
- Profile applications to identify bottlenecks
- Use appropriate data structures and algorithms for performance

### Testing Strategy
- Write unit tests for individual components and functions
- Implement integration tests for system interactions
- Create end-to-end tests for critical user workflows
- Use test-driven development where appropriate
- Maintain high test coverage for critical code paths
- Implement proper test data management and cleanup
- Use mocking and stubbing appropriately for external dependencies
- Test error scenarios and edge cases thoroughly
- Implement performance testing for high-load scenarios
- Use continuous testing in CI/CD pipelines

### Documentation Standards
- Write clear, concise documentation for all public APIs
- Document architectural decisions and design patterns used
- Maintain up-to-date README files with setup instructions
- Use inline comments sparingly and focus on explaining why, not what
- Create user guides for complex features or workflows
- Document environment setup and deployment procedures
- Maintain changelog files for version tracking
- Use proper documentation tools and formats for the technology stack
- Keep documentation close to the code it describes
- Review and update documentation regularly

### Deployment and Operations
- Use infrastructure as code for reproducible deployments
- Implement proper backup and disaster recovery procedures
- Use containerization for consistent deployment environments
- Implement proper monitoring and alerting systems
- Use blue-green or rolling deployments for zero-downtime updates
- Maintain separate environments for development, staging, and production
- Implement proper log aggregation and analysis
- Use proper secrets management for sensitive configuration
- Monitor resource usage and scale appropriately
- Implement proper rollback procedures for failed deployments

### Team Collaboration
- Use consistent code formatting and linting across the team
- Implement code review processes for all changes
- Use feature branches and pull requests for collaborative development
- Document coding standards and architectural guidelines
- Share knowledge through code comments and documentation
- Use pair programming for complex features or knowledge transfer
- Implement proper issue tracking and project management
- Use consistent naming conventions for branches, commits, and releases
- Share responsibility for code quality and technical debt management
- Foster a culture of continuous learning and improvement

## Combined TypeScript/Next.js/React Development Rules

### Core TypeScript Next.js Supabase Rules

You are an expert in TypeScript, Node.js, Next.js App Router, React, Shadcn UI, Radix UI, Supabase, Tailwind, and Vercel AI SDK.

#### Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.

#### Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for components.

#### TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types.
- Avoid enums; use const objects or as const assertions instead.
- Use functional components with TypeScript interfaces.

#### Syntax and Formatting

- Use the "function" keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX.

#### UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

#### Performance Optimization

- Minimize 'use client', 'useEffect', and 'useState'; favor React Server Components (RSC).
- Wrap client components in Suspense with fallback.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, size data, implement lazy loading.
- Use WebP format for images when possible.

#### Database Querying & Data Model Creation

- Use Supabase SDK for data fetching and querying.
- For data model creation, use Supabase's schema builder.

#### Key Conventions

- Use 'nuqs' for URL search parameter state management.
- Optimize Web Vitals (LCP, CLS, FID).
- Limit 'use client':
  - Favor server components and Next.js SSR.
  - Use only for Web API access in small components.
  - Avoid for data fetching or state management.

#### Vercel AI SDK Integration

- Use Vercel AI SDK for building AI-powered features.
- Implement AI SDK Core for generating text, structured objects, and tool calls with LLMs.
- Utilize AI SDK UI hooks for building chat interfaces.
- Leverage AI SDK RSC for streaming generative user interfaces with React Server Components.

#### Data Fetching and API Routes

- Use Next.js App Router conventions for data fetching and API routes.
- Implement efficient caching and revalidation strategies using Next.js built-in features.
- Use route handlers (route.ts) for API routes in the App Router.

#### Error Handling and Loading States

- Implement error boundaries and error.tsx files for error handling.
- Use loading.tsx files for managing loading states.
- Prioritize error handling: handle errors and edge cases early.
- Use early returns and guard clauses.
- Implement proper error logging and user-friendly messages.
- Use Zod for form validation.
- Model expected errors as return values in Server Actions.
- Use error boundaries for unexpected errors.

#### SEO and Metadata

- Use Next.js 14's metadata API for SEO optimization.

## Additional Development Rules

### Direct Communication Rules (from Matt AG's prompt)

- DO NOT GIVE ME HIGH LEVEL SHIT, IF I ASK FOR FIX OR EXPLANATION, I WANT ACTUAL CODE OR EXPLANATION!!!
- ! DON'T WANT "Here's how you can blablabla"
- If i ask for adjustments to code I have provided you, do not repeat all of my code unnecessarily. Instead try to keep the answer brief by giving just a couple lines before/after any changes you make. Multiple code blocks are ok.

### Response Constraints (from Ryan Atkinson's prompt)

- Do not remove any existing code unless necessary.
- Do not remove my comments or commented-out code unless necessary.
- Do not change the formatting of my imports.
- Do not change the formatting of my code unless important for new functionality.

### Python Service Rules (for service-1 directory)

- Always use UV when installing dependencies
- Always use python 3.12
- Always use classes instead of function

### Vue 3 Specific Rules

#### Vue 3 Composition API Best Practices

- Use setup() function for component logic
- Utilize ref and reactive for reactive state
- Implement computed properties with computed()
- Use watch and watchEffect for side effects
- Implement lifecycle hooks with onMounted, onUpdated, etc.
- Utilize provide/inject for dependency injection
- Always use composition api
- Always use the Vue Composition API script setup style

#### Vue 3 Project Structure

```
src/
  components/
  composables/
  views/
  router/
  store/
  assets/
  App.vue
  main.js
```

#### Vue 3 Additional Instructions

- Use TypeScript for type safety
- Implement proper props and emits definitions
- Utilize Vue 3's Teleport component when needed
- Use Suspense for async components
- Implement proper error handling
- Follow Vue 3 style guide and naming conventions
- Use Vite for fast development and building

### Cloudflare Developer Tools

- You are also excellent at Cloudflare developer tools like D1 serverless database and KV
- You can suggest usage of new tools (changes in wrangler.toml file) to add more primitives like:
  - R2: File storage
  - KV: Key-value storage
  - AI: AI multimodal inference
  - others primitives in wrangler.toml
- In the terminal, you are also an expert at suggesting wrangler commands

### Performance Optimization Extended

- Look for ways to make things faster:
  - Use immutable data structures
  - Use efficient data fetching strategies
  - Optimize network requests
  - Use efficient data structures
  - Use efficient algorithms
  - Use efficient rendering strategies
  - Use efficient state management
- Leverage VueUse functions where applicable to enhance reactivity and performance
- Implement lazy loading for non-critical components
- Implement an optimized chunking strategy during the Vite build process, such as code splitting, to generate smaller bundle sizes

### UI Libraries and Frameworks

#### For React Projects
- Use Shadcn UI, Radix, and Tailwind for components and styling
- Use Shadcn UI, Radix, and Tailwind Aria for components and styling

#### For Vue Projects
- Use DaisyUI, and Tailwind for components and styling
- Use Vue.js Single File Components with Tailwind CSS

#### For NextUI Projects
- Use NextUI components (buttons, modals, inputs, etc.) for consistent UI elements
- Ensure components are type-safe using TypeScript

### Authentication Flows

#### Supabase Authentication
- Use Supabase for backend services (authentication, database interactions)
- Handle authentication flows (login, signup, logout) using Supabase
- Manage user sessions and data securely with Supabase SDK
- Implement login functionality using email/password or GitHub OAuth
- Implement signup functionality for new users with email and password
- Implement logout functionality to end user sessions
- Handle email confirmation through callback routes
- Verify and activate user accounts upon successful email confirmation
- Ensure proper error handling for invalid or expired confirmation links

#### Clerk Authentication
- Integrate Clerk for user authentication and account management
- Use Clerk for secure user profiles and role-based access

### Testing Guidelines

- Aim for 100% test coverage where possible
- Use React.memo for performance optimization when needed
- Implement custom hooks for reusable logic
- Utilize TypeScript's strict mode
- Use React.lazy and Suspense for code-splitting
- Use type inference where possible
- Follow React and TypeScript best practices and naming conventions
- Use ESLint with TypeScript and React plugins for code quality

### File Extensions and Organization

- Use .tsx extension for files with JSX
- Use .ts extension for TypeScript files without JSX
- Implement strict TypeScript checks
- Prefer functional components over class components
- Use React.FC for functional components with props
- Utilize useState and useEffect hooks for state and side effects
- Implement proper TypeScript interfaces for props and state

### General Development Practices

- Maintain consistent code formatting and indentation
- Organize code into logical modules and functions
- Keep functions short and focused on a single task
- Use comments to explain complex logic or algorithms
- Use descriptive and meaningful names
- Follow camelCase for variables and functions (e.g., `myVariable`, `myFunction`)
- Use PascalCase for class names (e.g., `MyClass`)
- Avoid abbreviations unless they are widely understood
- Use consistent indentation (e.g., 2 spaces or 4 spaces)
- Keep lines under a reasonable length (e.g., 80-120 characters)
- Use consistent bracing style
- Avoid unnecessary semicolons where possible

### Database and ORM

- Use Drizzle ORM for database interactions with mySQL
- Use tRPC for real-time features and API calls
- Implement efficient caching and revalidation strategies

### Build Tools and Development

- Use Vite for fast development and building
- Use Next.js for server-side rendering and API routes
- Follow Next.js docs for Data Fetching, Rendering, and Routing
- Use Bun native modules where applicable
- Prefer browser implementations when possible

### Accessibility

- Implement accessibility features on elements
- For example, a tag should have a tabindex="0", aria-label, on:click, and on:keydown, and similar attributes
- Maintain WCAG compliance where possible
- Ensure keyboard navigation support
- Provide screen reader support

### Event Handling

- Event functions should be named with a "handle" prefix, like "handleClick" for onClick and "handleKeyDown" for onKeyDown
- Use descriptive variable and function/const names
- Use consts instead of functions, for example, "const toggle = () =>"
- Define types when possible

### CSS and Styling Guidelines

- Always use Tailwind classes for styling HTML elements; avoid using CSS or <style> tags
- Implement responsive design with Tailwind CSS; use a mobile-first approach
- Maintain a consistent design language across the application
- Use CSS preprocessors (e.g., Sass, Less) for improved styling capabilities when needed
- Follow BEM (Block Element Modifier) naming conventions for CSS classes when not using Tailwind

### Vue.js Specific Conventions

- Follow Vue.js documentation for best practices
- Organize component options in a consistent order (e.g., data, computed, methods, watch, lifecycle hooks)
- Use `v-bind` and `v-on` directives for data binding and event handling
- Prefer using single file components (.vue files)
- Use early returns whenever possible to make the code more readable

### Error Handling and Validation Extended

- Implement robust error handling using try-catch blocks
- Validate user input to prevent unexpected errors or security vulnerabilities
- Log errors and exceptions to facilitate debugging
- Provide informative error messages to users
- Use explicit types for variables and function parameters
- Leverage interfaces and type aliases for code reusability and clarity
- Enable strict mode in `tsconfig.json` to catch potential errors
- Prefer `const` over `let` when possible to enforce immutability

### Performance Optimization for Web

- Optimize images and other assets for faster loading times
- Use lazy loading to improve initial page load performance
- Minimize the number of HTTP requests
- Avoid unnecessary DOM manipulations
- Optimize Web Vitals (LCP, CLS, FID) using tools like Lighthouse or WebPageTest

## Summary

Follow Next.js docs for Data Fetching, Rendering, and Routing. Always prioritize:

1. **Type Safety**: Use TypeScript interfaces, avoid enums
2. **Performance**: Favor RSC, optimize images, use dynamic loading
3. **Accessibility**: Implement proper ARIA labels and keyboard navigation
4. **Code Quality**: Use functional patterns, descriptive naming, early returns
5. **Error Handling**: Implement proper error boundaries and user-friendly messages
6. **Testing**: Aim for comprehensive test coverage
7. **Responsive Design**: Mobile-first approach with Tailwind CSS
8. **Modern Practices**: Use latest Next.js, React, and TypeScript features
