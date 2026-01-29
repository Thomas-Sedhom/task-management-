# Task management task with rate limiting middleware 
## Project architecture 
The project follows a clean and modular architecture to ensure scalability and maintainability. Below is the structure of the src folder:
```
src/
│
├── common/
│   ├── decorator/
│   ├── filter/
│   ├── guard/
│   ├── interceptor/
│   ├── interface/
│   └── utils/
│
├── config/
│   ├── swagger.config.ts
│
├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   ├── interface/
│   │   ├── schema/
│   │   ├── auth.controller.ts
│   │   ├── auth.controller.spec.ts
│   │   ├── auth.service.ts
│   │   ├── auth.service.spec.ts
│   │   ├── auth.module.ts
│
└── environment/
│   ├── development.env
│
├── app.module.ts
├── main.ts
```
