# Simple Diagrams for Each Commit

## Commit 1: Setup Monorepo Structure

```mermaid
graph LR
    Root[Root Folder] --> Apps[apps folder]
    Root --> Server[server folder]
    
    Apps --> Bare[task-app-bare]
    Apps --> Complete[task-app-complete]
    
    style Root fill:#4CAF50,color:#fff
    style Apps fill:#2196F3,color:#fff
    style Server fill:#FF9800,color:#fff
    style Bare fill:#9C27B0,color:#fff
    style Complete fill:#9C27B0,color:#fff
```

**What we learn:** Project structure

---

## Commit 2: Express Server + MongoDB

```mermaid
graph LR
    Server[Express Server] -->|Connects| MongoDB[(MongoDB)]
    Server -->|Has| TaskModel[Task Model]
    
    style Server fill:#FF9800,color:#fff
    style MongoDB fill:#9C27B0,color:#fff
    style TaskModel fill:#2196F3,color:#fff
```

**What we learn:** Backend setup and database connection

---

## Commit 3: Task CRUD Endpoints

```mermaid
graph LR
    API[API Endpoints] --> Get[GET - Read]
    API --> Post[POST - Create]
    API --> Put[PUT - Update]
    API --> Delete[DELETE - Delete]
    
    style API fill:#4CAF50,color:#fff
    style Get fill:#2196F3,color:#fff
    style Post fill:#FF9800,color:#fff
    style Put fill:#9C27B0,color:#fff
    style Delete fill:#F44336,color:#fff
```

**What we learn:** REST API basics (CRUD operations)

---

## Commit 4: Auth Endpoints + JWT

```mermaid
graph LR
    Auth[Auth Routes] --> Register[Register]
    Auth --> Login[Login]
    Login -->|Returns| Token[JWT Token]
    Token -->|Protects| Tasks[Task Routes]
    
    style Auth fill:#FF9800,color:#fff
    style Register fill:#2196F3,color:#fff
    style Login fill:#2196F3,color:#fff
    style Token fill:#9C27B0,color:#fff
    style Tasks fill:#4CAF50,color:#fff
```

**What we learn:** Authentication and security

---

## Commit 5: Angular App Structure

```mermaid
graph TD
    App[App Component] -->|Contains| Components[Components]
    App -->|Uses| Services[Services]
    App -->|Has| Routes[Routes]
    
    style App fill:#4CAF50,color:#fff
    style Components fill:#2196F3,color:#fff
    style Services fill:#FF9800,color:#fff
    style Routes fill:#9C27B0,color:#fff
```

**What we learn:** Angular app structure

---

## Commit 6: Components and Templates

```mermaid
graph LR
    Component[Component] -->|Has| Template[Template HTML]
    Component -->|Has| Class[TypeScript Class]
    Template -->|Shows| Data[{{ data }}]
    
    style Component fill:#4CAF50,color:#fff
    style Template fill:#2196F3,color:#fff
    style Class fill:#FF9800,color:#fff
    style Data fill:#9C27B0,color:#fff
```

**What we learn:** Components = Template + Class

---

## Commit 7: Data Binding

```mermaid
graph LR
    Binding[Data Binding] -->|One way| Property[Property Binding<br/>[value]]
    Binding -->|One way| Event[Event Binding<br/>(click)]
    Binding -->|Two way| TwoWay[Two-way Binding<br/>[(ngModel)]]
    
    style Binding fill:#4CAF50,color:#fff
    style Property fill:#2196F3,color:#fff
    style Event fill:#FF9800,color:#fff
    style TwoWay fill:#9C27B0,color:#fff
```

**What we learn:** Three types of data binding

---

## Commit 8: Directives

```mermaid
graph LR
    Directives[Directives] --> NgIf[*ngIf<br/>Show or hide]
    Directives --> NgFor[*ngFor<br/>Loop through list]
    Directives --> NgClass[[ngClass]<br/>Add CSS classes]
    
    style Directives fill:#4CAF50,color:#fff
    style NgIf fill:#2196F3,color:#fff
    style NgFor fill:#FF9800,color:#fff
    style NgClass fill:#9C27B0,color:#fff
```

**What we learn:** Built-in Angular directives

---

## Commit 9: Pipes

```mermaid
graph LR
    Data[Raw Data] -->|Pipe| Formatted[Formatted Data]
    
    Data -->|date pipe| Date[Formatted Date]
    Data -->|uppercase pipe| Upper[UPPERCASE]
    Data -->|custom pipe| Custom[Custom Format]
    
    style Data fill:#4CAF50,color:#fff
    style Formatted fill:#2196F3,color:#fff
    style Date fill:#FF9800,color:#fff
    style Upper fill:#9C27B0,color:#fff
    style Custom fill:#F44336,color:#fff
```

**What we learn:** Pipes transform data for display

---

## Commit 10: Routing

```mermaid
graph LR
    URL[URL Path] -->|/| Home[Home Page]
    URL -->|/tasks| List[Task List]
    URL -->|/tasks/new| Form[New Task Form]
    URL -->|/tasks/123| Detail[Task Detail]
    
    style URL fill:#4CAF50,color:#fff
    style Home fill:#2196F3,color:#fff
    style List fill:#FF9800,color:#fff
    style Form fill:#9C27B0,color:#fff
    style Detail fill:#F44336,color:#fff
```

**What we learn:** Different URLs show different pages

---

## Commit 11: Forms and Validation

```mermaid
graph TD
    Form[Form] -->|User types| Input[Input Field]
    Input -->|Checks| Valid[Valid?]
    Valid -->|Yes| Submit[Can Submit]
    Valid -->|No| Error[Show Error]
    
    style Form fill:#4CAF50,color:#fff
    style Input fill:#2196F3,color:#fff
    style Valid fill:#FF9800,color:#fff
    style Submit fill:#9C27B0,color:#fff
    style Error fill:#F44336,color:#fff
```

**What we learn:** Forms with validation rules

---

## Commit 12: Services and HTTP

```mermaid
graph LR
    Component[Component] -->|Uses| Service[Service]
    Service -->|HTTP Request| Backend[Backend API]
    Backend -->|Response| Service
    Service -->|Data| Component
    
    style Component fill:#4CAF50,color:#fff
    style Service fill:#FF9800,color:#fff
    style Backend fill:#2196F3,color:#fff
```

**What we learn:** Services get data from API

---

## Commit 13: Interceptors

```mermaid
graph LR
    Request[HTTP Request] -->|Goes through| Interceptor[Interceptor]
    Interceptor -->|Adds token| Request2[Request with Token]
    Request2 --> Backend[Backend]
    Backend -->|Error?| ErrorInterceptor[Error Interceptor]
    ErrorInterceptor -->|Shows| UserMessage[User-friendly message]
    
    style Request fill:#4CAF50,color:#fff
    style Interceptor fill:#FF9800,color:#fff
    style Request2 fill:#2196F3,color:#fff
    style Backend fill:#9C27B0,color:#fff
    style ErrorInterceptor fill:#F44336,color:#fff
    style UserMessage fill:#FF9800,color:#fff
```

**What we learn:** Interceptors modify requests and handle errors

---

## Commit 14: Auth Guard

```mermaid
graph TD
    User[User tries to visit page] -->|Route protected| Guard[Auth Guard]
    Guard -->|Has token?| Check{Logged in?}
    Check -->|Yes| Allow[Allow access]
    Check -->|No| Block[Redirect to login]
    
    style User fill:#4CAF50,color:#fff
    style Guard fill:#FF9800,color:#fff
    style Check fill:#2196F3,color:#fff
    style Allow fill:#9C27B0,color:#fff
    style Block fill:#F44336,color:#fff
```

**What we learn:** Guards protect routes

---

## Commit 15: State Management

```mermaid
graph LR
    Service[State Service] -->|Holds| State[Current State]
    Component1[Component 1] -->|Subscribes| State
    Component2[Component 2] -->|Subscribes| State
    Component1 -->|Updates| State
    State -->|Notifies| Component2
    
    style Service fill:#4CAF50,color:#fff
    style State fill:#FF9800,color:#fff
    style Component1 fill:#2196F3,color:#fff
    style Component2 fill:#9C27B0,color:#fff
```

**What we learn:** Shared state between components

---

## Commit 16: Reusable Components

```mermaid
graph TD
    App[App] -->|Uses| TaskCard[TaskCard Component]
    App -->|Uses| Loading[Loading Component]
    App -->|Uses| Error[Error Component]
    
    TaskCard -->|Reusable| ManyPlaces[Used in many places]
    
    style App fill:#4CAF50,color:#fff
    style TaskCard fill:#2196F3,color:#fff
    style Loading fill:#FF9800,color:#fff
    style Error fill:#F44336,color:#fff
    style ManyPlaces fill:#9C27B0,color:#fff
```

**What we learn:** Reusable UI components

---

## 🎓 Learning Path Summary

```mermaid
graph TD
    Start[Start Learning] --> Backend[Backend Setup<br/>Commits 1-4]
    Backend --> Basics[Angular Basics<br/>Commits 5-8]
    Basics --> Advanced[Advanced Features<br/>Commits 9-12]
    Advanced --> Expert[Expert Level<br/>Commits 13-16]
    Expert --> Complete[Complete App!]
    
    style Start fill:#4CAF50,color:#fff
    style Backend fill:#FF9800,color:#fff
    style Basics fill:#2196F3,color:#fff
    style Advanced fill:#9C27B0,color:#fff
    style Expert fill:#F44336,color:#fff
    style Complete fill:#4CAF50,color:#fff
```
