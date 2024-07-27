# brainstorm-web

This is a small project for looking for the possibility to save artist time or increasing conversion rate, in different way.

Current scenario is the tool will help artist to generate a better product intro.

### Technical Features

- [NextJS](https://nextjs.org/)
- [React-Query](https://tanstack.com/query/latest)
- [Axios](https://github.com/axios/axios)
- [React-Hook-Form](https://react-hook-form.com/)
- [zustand](https://github.com/pmndrs/zustand)

### Dev Environment Setup

- Clone this repository
  - `git clone https://github.com/dychendavid/brainstorm-web`
- Go to the directory
  - `cd brainstorm-web`
- Install node modules
  - `npm install`
- Create .env and setup API url, replace XXX depends on your environment
  - `echo "NEXT_PUBLIC_API_URL=xxx" >> .env`
  - Local: http://127.0.0.1:3001
  - Production: https://brainstorm-api-545bd2c50ee9.herokuapp.com
- Execute
  - `npm run dev`

### Sequence Diagram

#### Home Page

```mermaid
sequenceDiagram
    actor U as User
    participant F as Frontend
    participant B as Backend

    U->>F: Start / Reload
    activate F
    F->>B: GET /api/v1/products/available
    activate B
    B-->>F: response
    deactivate F
    deactivate B
```

#### Wizard Page

```mermaid
sequenceDiagram
    actor U as User
    participant F as Frontend
    participant B as Backend

    U->>F: Start / Reload
    activate F
    F->>B: POST /api/v1/authorize
    B-->>F: response
    deactivate F
    U->>F: User input product info
    F->>F: Draft auto saver
    activate F
    U->>F: User click Next
    F->>F: Save info in Cookie
    deactivate F
    U->>F: User click Generate
    activate F
    F->>B: POST /api/v1/products/intro_gpt/:id
    B-->>F: response
    deactivate F
```

#### Editor Page

```mermaid
sequenceDiagram
    actor U as User
    participant F as Frontend
    participant B as Backend
    U->>F: Start / Reload
    activate F
    F->>B: POST /api/v1/authorize
    B-->>F: response
    deactivate F

    U->>F: User fine tune product name and intro
    F->>F: Draft auto saver
    U->>F: User click save
    activate F
    F->>B: PUT /api/v1/products/:id
    B-->>F: response
    deactivate F
```
