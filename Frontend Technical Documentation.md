# Knowledge Base Application Frontend Documentation

## Overview
The frontend of the Knowledge Base Application is built using React.js. It provides a user interface for accessing documentation stored in Markdown files, user authentication, and search functionality.

## Project Structure

```
frontend/
├── public/
│ ├── index.html
│ ├── favicon.ico
│ ├── manifest.json
│ └── robots.txt
├── src/
│ ├── assets/
│ │ ├── images/
│ │ │ ├── login-logo.png
│ │ │ └── logo.png
│ ├── components/
│ │ ├── Content/
│ │ │ ├── WarningBox.js
│ │ │ ├── CautionBox.js
│ │ │ ├── InfoBox.js
│ │ │ ├── MarkdownViewer.js
│ │ │ ├── NoteBox.js
│ │ │ ├── SearchResults.js
│ │ │ └── VideoPlayer.js
│ │ ├── Layout/
│ │ │ ├── Header.js
│ │ │ ├── Layout.js
│ │ │ ├── Sidebar.js
│ │ │ └── ContentIndex.js
│ │ └── Auth/
│ │ └── Login.js
│ ├── pages/
│ │ ├── HomePage.js
│ │ ├── ManualHomePage.js
│ │ ├── LoginPage.js
│ │ ├── ProfilePage.js
│ │ ├── NotFoundPage.js
│ │ ├── ManualContentPage.js
│ │ └── ContentPage.js
│ ├── services/
│ │ ├── auth.service.js
│ │ └── api.service.js
│ ├── config/
│ │ └── api.config.js
│ ├── contexts/
│ │ └── AuthContext.js
│ ├── NavigationHandler.js
│ ├── reportWebVitals.js
│ ├── setupTests.js
│ ├── App.js
│ ├── App.css
│ ├── index.css
│ └── index.js
├── .env
├── .dockerignore
├── .gitignore
├── Dockerfile
├── Dockerfile.dev
├── nginx.conf
├── package-lock.sjon
└── package.json
```


## Key Components

- **public/**: Contains static files that are served directly.
  - **index.html**: The main HTML file that serves as the entry point for the React application.
  - **favicon.ico**: The icon displayed in the browser tab.
  - **manifest.json**: Provides metadata for the web application, such as icons and theme colors.
  - **robots.txt**: Instructs web crawlers on how to index the site.

- **src/**: Contains the source code for the application.
  - **assets/**: Holds static assets like images.
    - **images/**: Contains image files used in the application, such as logos.
  - **components/**: Contains reusable React components.
    - **Content/**: Components related to displaying content.
      - **WarningBox.js, CautionBox.js, InfoBox.js, NoteBox.js**: Components for displaying different types of informational boxes.
      - **MarkdownViewer.js**: Renders Markdown content.
      - **SearchResults.js**: Displays search results.
      - **VideoPlayer.js**: Embeds and plays video content.
    - **Layout/**: Components related to the layout of the application.
      - **Header.js**: Displays the application header.
      - **Layout.js**: Manages the overall layout structure.
      - **Sidebar.js**: Displays the navigation sidebar.
      - **ContentIndex.js**: Shows the table of contents for a document.
    - **Auth/**: Components related to authentication.
      - **Login.js**: Manages the login form and process.
  - **pages/**: Contains page components that represent different views.
    - **HomePage.js, ManualHomePage.js, LoginPage.js, ProfilePage.js, NotFoundPage.js, ManualContentPage.js, ContentPage.js**: Different pages of the application, each handling specific routes and views.
  - **services/**: Contains service modules for API interactions.
    - **auth.service.js**: Handles authentication-related API calls.
    - **api.service.js**: Manages general API requests.
  - **config/**: Configuration files for the application.
    - **api.config.js**: Contains API endpoint configurations.
  - **contexts/**: Provides context for global state management.
    - **AuthContext.js**: Manages authentication state and context.
  - **NavigationHandler.js**: Handles navigation logic.
  - **reportWebVitals.js**: Measures performance metrics.
  - **setupTests.js**: Configures testing environment.
  - **App.js**: The root component of the application.
  - **App.css, index.css**: Stylesheets for the application.
  - **index.js**: The entry point for the React application.

- **.env**: Environment variables for configuration.
- **.dockerignore**: Specifies files to ignore when building Docker images.
- **.gitignore**: Specifies files to ignore in version control.
- **Dockerfile**: Defines the production Docker image.
- **Dockerfile.dev**: Defines the development Docker image.
- **nginx.conf**: Configuration for serving the application with Nginx.
- **package-lock.json**: Records the exact versions of installed dependencies.
- **package.json**: Lists project dependencies and scripts.