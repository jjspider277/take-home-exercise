# Customer Persona API

A NestJS backend API for the Customer Persona Experience App that generates customer personas and provides a chat experience.

## Features

- Company information storage
- AI-powered customer persona generation
- Interactive chat experience with generated personas
- RESTful API with Swagger documentation

## Tech Stack

- NestJS framework
- TypeScript
- OpenAI integration (configurable)
- Swagger API documentation

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd customer-persona-api
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory based on `.env.example`
```
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server
```bash
npm run start:dev
# or
yarn start:dev
```

5. Access the Swagger API documentation at [http://localhost:3001/api](http://localhost:3001/api)

## API Endpoints

### Company

- `POST /company` - Store company information

### Persona

- `POST /persona/generate` - Generate a customer persona based on company information

### Chat

- `POST /chat` - Get a response from the persona based on user message

## Project Structure

```
customer-persona-api/
├── src/
│   ├── common/              # Common utilities and DTOs
│   │   └── dto/
│   │       └── api-response.dto.ts
│   ├── config/              # Configuration files
│   │   └── openai.config.ts
│   ├── modules/             # Feature modules
│   │   ├── company/         # Company module
│   │   │   ├── dto/
│   │   │   ├── company.controller.ts
│   │   │   ├── company.module.ts
│   │   │   └── company.service.ts
│   │   ├── persona/         # Persona module
│   │   │   ├── dto/
│   │   │   ├── persona.controller.ts
│   │   │   ├── persona.module.ts
│   │   │   └── persona.service.ts
│   │   └── chat/            # Chat module
│   │       ├── dto/
│   │       ├── chat.controller.ts
│   │       ├── chat.module.ts
│   │       └── chat.service.ts
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── .env                     # Environment variables (create this file)
├── .env.example             # Example environment variables
├── nest-cli.json            # NestJS CLI configuration
├── package.json             # Project dependencies
├── tsconfig.json            # TypeScript configuration
└── README.md                # Project documentation
```

## Implementation Notes

- The application uses mock data for demonstration purposes. In a production environment, you would integrate with an actual AI service like OpenAI.
- To use a real AI service, update the API key in your `.env` file.
- The API is designed to work with the Customer Persona Experience App frontend.

## Future Enhancements

- Add database integration for persistent storage
- Implement authentication and authorization
- Add more sophisticated AI prompts for better persona generation
- Implement WebSockets for real-time chat experience