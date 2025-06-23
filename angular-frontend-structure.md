# Angular Frontend Structure for To-Let Project

This document outlines the recommended Angular project structure for the To-Let application frontend, designed to complement the existing microservices backend architecture.

## Project Structure Overview

```
to-let-frontend/
├── src/
│   ├── app/
│   │   ├── core/                  # Core functionality used throughout the app
│   │   │   ├── authentication/    # Authentication services and guards
│   │   │   ├── interceptors/      # HTTP interceptors (auth, error handling)
│   │   │   ├── services/          # Global services (e.g., error handling)
│   │   │   ├── models/            # Global models/interfaces
│   │   │   └── core.module.ts     # Core module definition
│   │   │
│   │   ├── features/              # Feature modules (aligned with backend services)
│   │   │   ├── user/              # User management features
│   │   │   ├── property/          # Property listing features
│   │   │   ├── chat/              # Chat functionality
│   │   │   ├── notification/      # Notification features
│   │   │   ├── payment/           # Payment features
│   │   │   └── search/            # Search functionality
│   │   │
│   │   ├── shared/                # Shared components, directives, and pipes
│   │   │   ├── components/        # Reusable UI components
│   │   │   ├── directives/        # Custom directives
│   │   │   ├── pipes/             # Custom pipes
│   │   │   └── shared.module.ts   # Shared module definition
│   │   │
│   │   ├── layout/                # Application layout components
│   │   │   ├── header/            # Header component
│   │   │   ├── footer/            # Footer component
│   │   │   ├── sidebar/           # Sidebar component
│   │   │   └── layout.module.ts   # Layout module definition
│   │   │
│   │   ├── app-routing.module.ts  # Main routing configuration
│   │   ├── app.component.ts       # Root component
│   │   ├── app.component.html     # Root component template
│   │   ├── app.component.scss     # Root component styles
│   │   └── app.module.ts          # Root module
│   │
│   ├── assets/                    # Static assets
│   │   ├── images/                # Image files
│   │   ├── icons/                 # Icon files
│   │   └── fonts/                 # Font files
│   │
│   ├── environments/              # Environment configuration
│   │   ├── environment.ts         # Development environment
│   │   └── environment.prod.ts    # Production environment
│   │
│   ├── styles/                    # Global styles
│   │   ├── _variables.scss        # SCSS variables
│   │   ├── _mixins.scss           # SCSS mixins
│   │   └── global.scss            # Global styles
│   │
│   ├── index.html                 # Main HTML file
│   └── main.ts                    # Application entry point
│
├── angular.json                   # Angular CLI configuration
├── package.json                   # NPM dependencies and scripts
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

## Detailed Structure Explanation

### Core Module

The Core module contains singleton services that are loaded once when the application starts and are used throughout the application.

```
core/
├── authentication/
│   ├── auth.service.ts            # Authentication service
│   ├── token.service.ts           # JWT token handling
│   ├── auth.guard.ts              # Route guard for protected routes
│   └── role.guard.ts              # Route guard for role-based access
├── interceptors/
│   ├── auth.interceptor.ts        # Adds auth token to requests
│   ├── error.interceptor.ts       # Global error handling
│   └── loader.interceptor.ts      # Loading indicator for HTTP requests
├── services/
│   ├── error.service.ts           # Error handling service
│   ├── logger.service.ts          # Logging service
│   └── api.service.ts             # Base API service
├── models/
│   ├── user.model.ts              # User model
│   ├── api-response.model.ts      # API response model
│   └── error.model.ts             # Error model
└── core.module.ts                 # Core module definition
```

### Feature Modules

Feature modules are organized to align with the backend microservices. Each feature module contains its own components, services, and routing.

#### User Feature Module

```
features/user/
├── pages/
│   ├── login/                     # Login page
│   ├── register/                  # Registration page
│   ├── profile/                   # User profile page
│   └── address-management/        # Address management page
├── components/
│   ├── user-info/                 # User information component
│   ├── profile-image/             # Profile image component
│   └── address-form/              # Address form component
├── services/
│   ├── user.service.ts            # User API service
│   ├── address.service.ts         # Address API service
│   └── membership.service.ts      # Membership API service
├── models/
│   ├── address.model.ts           # Address model
│   └── membership.model.ts        # Membership model
├── user-routing.module.ts         # User routing configuration
└── user.module.ts                 # User module definition
```

#### Property Feature Module

```
features/property/
├── pages/
│   ├── property-list/             # Property listing page
│   ├── property-detail/           # Property detail page
│   ├── property-create/           # Create property page
│   └── property-edit/             # Edit property page
├── components/
│   ├── property-card/             # Property card component
│   ├── property-form/             # Property form component
│   ├── property-images/           # Property images component
│   └── property-map/              # Property map component
├── services/
│   └── property.service.ts        # Property API service
├── models/
│   ├── property.model.ts          # Property model
│   ├── house-details.model.ts     # House details model
│   └── location.model.ts          # Location model
├── property-routing.module.ts     # Property routing configuration
└── property.module.ts             # Property module definition
```

#### Chat Feature Module

```
features/chat/
├── pages/
│   ├── chat-list/                 # Chat list page
│   └── chat-room/                 # Chat room page
├── components/
│   ├── chat-message/              # Chat message component
│   ├── message-input/             # Message input component
│   └── chat-header/               # Chat header component
├── services/
│   ├── chat.service.ts            # Chat API service
│   └── websocket.service.ts       # WebSocket service
├── models/
│   ├── chat-room.model.ts         # Chat room model
│   └── chat-message.model.ts      # Chat message model
├── chat-routing.module.ts         # Chat routing configuration
└── chat.module.ts                 # Chat module definition
```

#### Notification Feature Module

```
features/notification/
├── pages/
│   └── notification-list/         # Notification list page
├── components/
│   ├── notification-item/         # Notification item component
│   └── notification-badge/        # Notification badge component
├── services/
│   └── notification.service.ts    # Notification API service
├── models/
│   └── notification.model.ts      # Notification model
├── notification-routing.module.ts # Notification routing configuration
└── notification.module.ts         # Notification module definition
```

#### Payment Feature Module

```
features/payment/
├── pages/
│   ├── payment-methods/           # Payment methods page
│   └── payment-history/           # Payment history page
├── components/
│   ├── payment-form/              # Payment form component
│   └── payment-card/              # Payment card component
├── services/
│   └── payment.service.ts         # Payment API service
├── models/
│   ├── payment.model.ts           # Payment model
│   └── transaction.model.ts       # Transaction model
├── payment-routing.module.ts      # Payment routing configuration
└── payment.module.ts              # Payment module definition
```

#### Search Feature Module

```
features/search/
├── pages/
│   └── search-results/            # Search results page
├── components/
│   ├── search-form/               # Search form component
│   ├── filter-sidebar/            # Filter sidebar component
│   └── search-map/                # Search map component
├── services/
│   └── search.service.ts          # Search API service
├── models/
│   └── search-criteria.model.ts   # Search criteria model
├── search-routing.module.ts       # Search routing configuration
└── search.module.ts               # Search module definition
```

### Shared Module

The Shared module contains components, directives, and pipes that are used across multiple feature modules.

```
shared/
├── components/
│   ├── buttons/                   # Button components
│   ├── cards/                     # Card components
│   ├── forms/                     # Form components
│   ├── modals/                    # Modal components
│   ├── loaders/                   # Loading indicators
│   └── alerts/                    # Alert components
├── directives/
│   ├── click-outside.directive.ts # Click outside directive
│   └── lazy-load.directive.ts     # Lazy loading directive
├── pipes/
│   ├── format-date.pipe.ts        # Date formatting pipe
│   └── truncate.pipe.ts           # Text truncation pipe
└── shared.module.ts               # Shared module definition
```

### Layout Module

The Layout module contains components that define the overall structure of the application.

```
layout/
├── header/
│   ├── header.component.ts        # Header component
│   ├── header.component.html      # Header template
│   └── header.component.scss      # Header styles
├── footer/
│   ├── footer.component.ts        # Footer component
│   ├── footer.component.html      # Footer template
│   └── footer.component.scss      # Footer styles
├── sidebar/
│   ├── sidebar.component.ts       # Sidebar component
│   ├── sidebar.component.html     # Sidebar template
│   └── sidebar.component.scss     # Sidebar styles
└── layout.module.ts               # Layout module definition
```

## State Management

For state management, we recommend using NgRx for complex state or RxJS with services for simpler state management:

```
app/
├── store/                         # NgRx store (optional)
│   ├── actions/                   # Store actions
│   ├── reducers/                  # Store reducers
│   ├── effects/                   # Store effects
│   ├── selectors/                 # Store selectors
│   └── state/                     # State interfaces
```

## API Communication

Each feature module should have its own service(s) for communicating with the corresponding backend microservice. These services should extend or use the base API service from the Core module.

## Routing Structure

The application should use a hierarchical routing structure:

1. Main routes in `app-routing.module.ts`
2. Feature-specific routes in each feature module's routing file
3. Lazy loading for feature modules to improve initial load time

## Styling Approach

We recommend using SCSS with:

1. Global styles in the `styles/` directory
2. Component-specific styles in each component's `.scss` file
3. Shared variables and mixins in `_variables.scss` and `_mixins.scss`

## Recommended Libraries

1. **Angular Material** - UI component library
2. **NgRx** - State management (for complex applications)
3. **RxJS** - Reactive programming
4. **ngx-socket-io** - WebSocket integration for chat
5. **Leaflet** or **Google Maps** - For property location maps
6. **ngx-dropzone** - For image uploads
7. **ngx-pagination** - For pagination
8. **ngx-toastr** - For notifications

## Development Workflow

1. Create the core structure first
2. Implement authentication and user features
3. Add property listing features
4. Implement search functionality
5. Add chat and notification features
6. Implement payment features
7. Refine and optimize

## Conclusion

This structure is designed to be modular, maintainable, and scalable. It aligns with the backend microservices architecture while following Angular best practices. Each feature module corresponds to a backend service, making it easier to understand and maintain the codebase.