# Customer Persona Experience App

This application generates customer personas based on company information and simulates a chat experience where users can help the persona solve challenges related to the company's products or services.

## Features

- Company information input (name and characteristics)
- AI-powered customer persona generation
- Interactive chat experience with the generated persona
- Server-side AI integration

## Tech Stack

- Next.js (React framework)
- TypeScript
- Tailwind CSS for styling
- Server-side API routes for AI integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd customer-persona-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your AI API keys (if needed)
```
# Example for OpenAI
OPENAI_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

```
customer-persona-app/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── chat/           # Chat API endpoint
│   │   └── generate-persona/ # Persona generation endpoint
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page component
├── components/             # React components
│   ├── CompanyInput.tsx    # Step 1: Company input form
│   ├── PersonaDisplay.tsx  # Step 2: Persona display
│   └── ChatExperience.tsx  # Step 3: Chat interface
├── lib/                    # Utility functions and types
│   └── types.ts            # TypeScript type definitions
├── public/                 # Static assets
├── .env.local              # Environment variables (create this file)
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Implementation Notes

- The application uses mock data for demonstration purposes. In a production environment, you would integrate with an actual AI service like OpenAI.
- To use a real AI service, update the API routes in `app/api/` with your preferred AI integration.
- The UI is responsive and works on both desktop and mobile devices.

## Future Enhancements

- Add more detailed persona generation with profile pictures
- Implement more sophisticated chat responses based on persona characteristics
- Add authentication for saving and retrieving personas
- Implement analytics to track user interactions