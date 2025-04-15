# Knowledge Base Application API Documentation

## Overview
The Knowledge Base Application provides a RESTful API for managing and accessing documentation stored in Markdown files. This documentation outlines the key API endpoints available for authentication, content management, and search functionality.

## API Endpoints

### Authentication

#### POST `/api/auth/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
- **Response**: 
    - **Success**:
    ```
    {
        "success": true,
        "data": {
            "token": "your_jwt_token",
            "username": "admin",
            "lastLogin": "2023-11-22T10:30:00.000Z"
        }
    }
    ```

    - **Error**:
    ```
    {
        "success": false,
        "message": "Invalid credentials"
    }
    ```


### Content Management

#### GET /api/content/tree
- **Description**: Retrieves the directory tree structure of Markdown files.
- **Response**: 
    - **Success**:
    ```
    {
    "success": true,
    "data": {
        "name": "0101-Setup-Procedures",
        "path": "0101-Setup-Procedures",
        "children": [
        {
            "name": "010101-Setup-System.md",
            "path": "0101-Setup-Procedures/010101-Setup-System.md"
        },
        {
            "name": "010102-Version-Setup.md",
            "path": "0101-Setup-Procedures/010102-Version-Setup.md"
        }
        ]
    }
    }
    ```
#### GET /api/content/file/:path
- **Description**: Retrieves the content of a specific Markdown file and its associated headings.
- **Response**: 
    - **Success**:
    ```
    {
    "success": true,
    "data": {
        "content": "# Setup System\n\n## Prerequisites\n- Node.js\n- MongoDB\n- Git",
        "headings": [
        { "level": 1, "text": "Setup System" },
        { "level": 2, "text": "Prerequisites" }
        ],
        "videos": [] // Array of related videos
    }
    }
    ```
### Search Functionality
#### GET /api/search?q=<markdown-file-path>
- **Description**: Searches for content within Markdow
- **Response**: 
    - **Success**:
    ```
    {
    "success": true,
    "data": {
        "results": [
        {
            "title": "Setup System",
            "path": "0101-Setup-Procedures/010101-Setup-System.md",
            "context": {
            "before": "This is the context before the match.",
            "match": "search term",
            "after": "This is the context after the match."
            },
            "relevance": 85 // Relevance score
        },
        // More results...
        ],
        "total": 1
    }
    }
    ```