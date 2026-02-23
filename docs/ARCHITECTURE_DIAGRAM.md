# Task App Architecture Diagram

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend - Angular Application"
        subgraph "Components"
            Home[HomeComponent]
            TaskList[TaskListComponent]
            TaskDetail[TaskDetailComponent]
            TaskForm[TaskFormComponent]
            Login[LoginComponent]
            Register[RegisterComponent]
            TaskCard[TaskCardComponent]
            Loading[LoadingComponent]
            ErrorMsg[ErrorMessageComponent]
        end
        
        subgraph "Services"
            TaskService[TaskService - HttpClient API calls]
            AuthService[AuthService - Authentication and JWT]
            TaskStateService[TaskStateService - BehaviorSubject State]
        end
        
        subgraph "Core Features"
            AuthGuard[AuthGuard - Route Protection]
            AuthInterceptor[AuthInterceptor - JWT Token Injection]
            ErrorInterceptor[ErrorInterceptor - Error Handling]
        end
        
        subgraph "Routing"
            Router[Angular Router]
        end
    end
    
    subgraph "Backend - Node.js/Express"
        subgraph "Routes"
            AuthRoutes[Auth Routes - register and login]
            TaskRoutes[Task Routes - CRUD operations]
        end
        
        subgraph "Middleware"
            AuthMiddleware[authenticateToken - JWT Verification]
            CORS[CORS Middleware]
            JSON[Express JSON Parser]
        end
        
        subgraph "Models"
            TaskModel[Task Model - Mongoose Schema]
            UserModel[User Model - Mongoose Schema]
        end
    end
    
    subgraph "Database"
        MongoDB[(MongoDB - Task and User Collections)]
    end
    
    %% Frontend connections
    Home --> Router
    TaskList --> TaskStateService
    TaskList --> TaskCard
    TaskDetail --> TaskService
    TaskForm --> TaskService
    Login --> AuthService
    Register --> AuthService
    
    TaskService --> AuthInterceptor
    TaskService --> ErrorInterceptor
    TaskService --> TaskStateService
    AuthService --> AuthInterceptor
    AuthService --> ErrorInterceptor
    
    Router --> AuthGuard
    AuthGuard --> AuthService
    
    %% Frontend to Backend
    AuthInterceptor --> AuthRoutes
    TaskService --> TaskRoutes
    
    %% Backend connections
    AuthRoutes --> UserModel
    TaskRoutes --> AuthMiddleware
    TaskRoutes --> TaskModel
    AuthMiddleware --> UserModel
    
    TaskModel --> MongoDB
    UserModel --> MongoDB
    
    %% Styling
    classDef frontend fill:#e1f5ff
    classDef backend fill:#fff4e1
    classDef database fill:#e8f5e9
    classDef service fill:#f3e5f5
    
    class Home,TaskList,TaskDetail,TaskForm,Login,Register,TaskCard,Loading,ErrorMsg,Router,AuthGuard frontend
    class AuthRoutes,TaskRoutes,AuthMiddleware,CORS,JSON,TaskModel,UserModel backend
    class MongoDB database
    class TaskService,AuthService,TaskStateService,AuthInterceptor,ErrorInterceptor service
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant TaskStateService
    participant TaskService
    participant AuthInterceptor
    participant Backend
    participant MongoDB
    
    User->>Component: User Action (Create Task)
    Component->>TaskStateService: createTask(task)
    TaskStateService->>TaskStateService: Optimistic Update
    TaskStateService->>Component: Update UI (immediate)
    TaskStateService->>TaskService: createTask(task)
    TaskService->>AuthInterceptor: HTTP POST /api/tasks
    AuthInterceptor->>AuthInterceptor: Add JWT Token
    AuthInterceptor->>Backend: POST /api/tasks (with token)
    Backend->>Backend: Verify JWT Token
    Backend->>MongoDB: Save Task
    MongoDB-->>Backend: Task Saved
    Backend-->>TaskService: Success Response
    TaskService-->>TaskStateService: Task Created
    TaskStateService->>TaskStateService: Update State (confirm)
    TaskStateService-->>Component: State Update
    Component-->>User: UI Updated
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant LoginComponent
    participant AuthService
    participant AuthInterceptor
    participant Backend
    participant MongoDB
    
    User->>LoginComponent: Enter Credentials
    LoginComponent->>AuthService: login(email, password)
    AuthService->>Backend: POST /api/auth/login
    Backend->>MongoDB: Verify User Credentials
    MongoDB-->>Backend: User Verified
    Backend->>Backend: Generate JWT Token
    Backend-->>AuthService: Token + User Data
    AuthService->>AuthService: Store Token (localStorage)
    AuthService-->>LoginComponent: Login Success
    LoginComponent->>LoginComponent: Navigate to Tasks
    
    Note over AuthInterceptor: Subsequent Requests
    User->>Component: Access Protected Route
    Component->>TaskService: API Call
    TaskService->>AuthInterceptor: HTTP Request
    AuthInterceptor->>AuthService: Get Token
    AuthService-->>AuthInterceptor: JWT Token
    AuthInterceptor->>AuthInterceptor: Add Authorization Header
    AuthInterceptor->>Backend: Request with Token
    Backend->>Backend: Verify Token
    Backend-->>Component: Protected Data
```

## Component Hierarchy

```mermaid
graph TD
    App[AppComponent]
    
    App --> Home[HomeComponent]
    App --> Login[LoginComponent]
    App --> Register[RegisterComponent]
    App --> TaskList[TaskListComponent]
    App --> TaskDetail[TaskDetailComponent]
    App --> TaskForm[TaskFormComponent]
    
    TaskList --> TaskCard[TaskCardComponent]
    TaskList --> Loading[LoadingComponent]
    TaskList --> ErrorMsg[ErrorMessageComponent]
    
    TaskDetail --> Loading
    TaskDetail --> ErrorMsg
    
    TaskForm --> Loading
    TaskForm --> ErrorMsg
    
    style App fill:#4CAF50,color:#fff
    style Home fill:#2196F3,color:#fff
    style Login fill:#FF9800,color:#fff
    style Register fill:#FF9800,color:#fff
    style TaskList fill:#9C27B0,color:#fff
    style TaskDetail fill:#9C27B0,color:#fff
    style TaskForm fill:#9C27B0,color:#fff
    style TaskCard fill:#607D8B,color:#fff
    style Loading fill:#795548,color:#fff
    style ErrorMsg fill:#F44336,color:#fff
```

## Backend API Structure

```mermaid
graph LR
    subgraph "Express Server"
        Server[server.js]
        Server --> AuthRoutes[Auth Routes - /api/auth]
        Server --> TaskRoutes[Task Routes - /api/tasks]
        Server --> AuthMW[Auth Middleware]
    end
    
    AuthRoutes --> Register[POST /register]
    AuthRoutes --> Login[POST /login]
    
    TaskRoutes --> List[GET /]
    TaskRoutes --> Detail[GET /:id]
    TaskRoutes --> Create[POST /]
    TaskRoutes --> Update[PUT /:id]
    TaskRoutes --> Delete[DELETE /:id]
    
    AuthMW --> TaskRoutes
    
    Register --> UserModel[User Model]
    Login --> UserModel
    List --> TaskModel[Task Model]
    Detail --> TaskModel
    Create --> TaskModel
    Update --> TaskModel
    Delete --> TaskModel
    
    UserModel --> MongoDB[(MongoDB)]
    TaskModel --> MongoDB
    
    style Server fill:#4CAF50,color:#fff
    style AuthRoutes fill:#FF9800,color:#fff
    style TaskRoutes fill:#2196F3,color:#fff
    style AuthMW fill:#9C27B0,color:#fff
    style UserModel fill:#607D8B,color:#fff
    style TaskModel fill:#607D8B,color:#fff
    style MongoDB fill:#E91E63,color:#fff
```

## State Management Flow

```mermaid
graph TB
    subgraph "TaskStateService"
        BS[BehaviorSubject - tasks$]
        LoadingBS[BehaviorSubject - loading$]
        ErrorBS[BehaviorSubject - error$]
    end
    
    subgraph "Components"
        TaskList[TaskListComponent]
        TaskDetail[TaskDetailComponent]
        TaskForm[TaskFormComponent]
    end
    
    subgraph "TaskService"
        API[HTTP API Calls]
    end
    
    TaskList -->|Subscribe| BS
    TaskList -->|Subscribe| LoadingBS
    TaskList -->|Subscribe| ErrorBS
    
    TaskDetail -->|Subscribe| BS
    
    TaskForm -->|createTask| BS
    TaskForm -->|updateTask| BS
    
    BS -->|Observable| TaskList
    BS -->|Observable| TaskDetail
    
    BS -->|Optimistic Update| TaskForm
    BS -->|Call| API
    API -->|Response| BS
    API -->|Error| ErrorBS
    
    style BS fill:#9C27B0,color:#fff
    style LoadingBS fill:#FF9800,color:#fff
    style ErrorBS fill:#F44336,color:#fff
    style TaskList fill:#2196F3,color:#fff
    style TaskDetail fill:#2196F3,color:#fff
    style TaskForm fill:#2196F3,color:#fff
    style API fill:#4CAF50,color:#fff
```

## Complete System Flow

```mermaid
flowchart TD
    Start([User Opens App]) --> CheckAuth{Authenticated?}
    CheckAuth -->|No| LoginPage[Login/Register Page]
    CheckAuth -->|Yes| HomePage[Home Page]
    
    LoginPage --> LoginAction[User Logs In]
    LoginAction --> AuthService[AuthService]
    AuthService --> BackendAuth[Backend: /api/auth/login]
    BackendAuth --> JWT[Generate JWT Token]
    JWT --> StoreToken[Store Token in localStorage]
    StoreToken --> HomePage
    
    HomePage --> NavTasks[Navigate to Tasks]
    NavTasks --> AuthGuard[AuthGuard Check]
    AuthGuard -->|Valid Token| TaskList[TaskListComponent]
    AuthGuard -->|Invalid Token| LoginPage
    
    TaskList --> LoadTasks[Load Tasks]
    LoadTasks --> TaskStateService[TaskStateService]
    TaskStateService --> TaskService[TaskService]
    TaskService --> AuthInterceptor[AuthInterceptor: Add Token]
    AuthInterceptor --> BackendAPI[Backend: /api/tasks]
    BackendAPI --> AuthMW[Auth Middleware: Verify Token]
    AuthMW -->|Valid| TaskModel[Task Model]
    AuthMW -->|Invalid| Error[401 Unauthorized]
    TaskModel --> MongoDB[(MongoDB)]
    MongoDB --> Response[API Response]
    Response --> TaskStateService
    TaskStateService --> UpdateUI[Update UI with Tasks]
    
    TaskList --> CreateTask[Create New Task]
    CreateTask --> TaskForm[TaskFormComponent]
    TaskForm --> Submit[Submit Form]
    Submit --> TaskStateService
    TaskStateService --> Optimistic[Optimistic Update]
    Optimistic --> TaskService
    TaskService --> BackendAPI
    
    style Start fill:#4CAF50,color:#fff
    style CheckAuth fill:#FF9800,color:#fff
    style LoginPage fill:#2196F3,color:#fff
    style HomePage fill:#2196F3,color:#fff
    style AuthService fill:#9C27B0,color:#fff
    style TaskStateService fill:#9C27B0,color:#fff
    style TaskService fill:#9C27B0,color:#fff
    style MongoDB fill:#E91E63,color:#fff
    style Error fill:#F44336,color:#fff
```
