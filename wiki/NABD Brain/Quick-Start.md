# Quick Start Guide - NABD Brain

Get NABD Brain running in your project in 5 minutes.

---

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Google AI API key (Gemini)

---

## Step 1: Environment Setup

Add your Gemini API key to the backend environment:

```bash
# server/.env
GEMINI_API_KEY=your_google_ai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/nabd
```

---

## Step 2: Database Migration

Run the Prisma migration to add AI-related tables:

```bash
cd server
npx prisma db push
```

This adds:
- `aiCreditsBalance` field to User (default: 100 credits)
- `FileMapping` table for uploaded file schemas
- `AIUsageLog` table for usage tracking

---

## Step 3: Start the Servers

```bash
# Terminal 1 - Frontend
pnpm dev

# Terminal 2 - Backend
cd server && pnpm dev
```

---

## Step 4: Test the API

```bash
# Check your credit balance
curl http://localhost:3001/api/ai/credits \
  -H "Authorization: Bearer YOUR_TOKEN"

# Generate a simple chart
curl -X POST http://localhost:3001/api/ai/chart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a bar chart",
    "data": [{"name": "A", "value": 100}, {"name": "B", "value": 200}]
  }'
```

---

## Step 5: Use in Frontend

```tsx
import { useAI } from '@/contexts/AIContext';

function MyComponent() {
  const { credits, generateChart, isProcessing } = useAI();

  const handleGenerate = async () => {
    const result = await generateChart("Show sales trend", myData);
    console.log(result.chartConfig);
  };

  return (
    <div>
      <p>Credits: {credits}</p>
      <button onClick={handleGenerate} disabled={isProcessing}>
        Generate Chart
      </button>
    </div>
  );
}
```

---

## What's Next?

- [API Reference](./API-Reference.md) - Full API documentation
- [Smart Routing](./Smart-Routing.md) - How the AI selects models
- [Best Practices](./Best-Practices.md) - Tips for optimal usage

---

*Need help? Check the [Troubleshooting](./Troubleshooting.md) guide.*
