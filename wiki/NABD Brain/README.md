# NABD Brain - AI Intelligence System

> The intelligent brain powering the NABD enterprise platform. A sophisticated multi-model AI system that automatically optimizes for cost and performance.

---

## Table of Contents

1. [What is NABD Brain?](#what-is-nabd-brain)
2. [Architecture](#architecture)
3. [The Three Modules](#the-three-modules)
4. [How Smart Routing Works](#how-smart-routing-works)
5. [Credit System](#credit-system)
6. [API Reference](#api-reference)
7. [Frontend Integration](#frontend-integration)
8. [Configuration](#configuration)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## What is NABD Brain?

NABD Brain is an intelligent AI system built specifically for business operations. Unlike simple AI integrations that use a single model, NABD Brain uses **three specialized AI modules** that work together to provide the best results at the lowest cost.

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Cost Optimized** | Automatically routes simple tasks to cheaper models, saving 80%+ on AI costs |
| **Context Aware** | Understands your department, role, and current work context |
| **Always Available** | Built-in retry logic and fallback models ensure reliability |
| **Enterprise Ready** | Credit system, usage tracking, and analytics included |

### What Can NABD Brain Do?

- **Generate Charts** - Create beautiful ECharts visualizations from your data
- **Build Tables** - Transform data into structured, sortable tables
- **Extract Tasks** - Convert meeting notes or emails into GTD-style action items
- **Forecast Trends** - Predict future values with confidence intervals
- **Provide Tips** - Get actionable recommendations based on your context
- **Deep Analysis** - Comprehensive strategic analysis for complex decisions
- **Process Files** - Automatically map and normalize uploaded data

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              NABD Brain                                   │
│                    "The Intelligent Business Assistant"                   │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                         ┌─────────────────┐                              │
│                         │  Smart Router   │                              │
│                         │                 │                              │
│                         │ • Analyzes prompt complexity                   │
│                         │ • Detects patterns & keywords                  │
│                         │ • Calculates confidence score                  │
│                         │ • Selects optimal module                       │
│                         └────────┬────────┘                              │
│                                  │                                        │
│              ┌───────────────────┼───────────────────┐                   │
│              │                   │                   │                    │
│              ▼                   ▼                   ▼                    │
│   ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐        │
│   │                  │ │                  │ │                  │        │
│   │   DATA PROCESSOR │ │   INTELLIGENCE   │ │    STRATEGIC     │        │
│   │     (Cleaner)    │ │     ENGINE       │ │     ADVISOR      │        │
│   │                  │ │     (Worker)     │ │    (Thinker)     │        │
│   │  Gemini 2.5 Flash│ │  Gemini 3 Flash  │ │   Gemini 3 Pro   │        │
│   │                  │ │                  │ │                  │        │
│   │    1 Credit      │ │    1 Credit      │ │    5 Credits     │        │
│   │                  │ │                  │ │                  │        │
│   │  • File parsing  │ │  • Charts        │ │  • Forecasting   │        │
│   │  • Schema maps   │ │  • Tables        │ │  • Deep analysis │        │
│   │  • Data cleaning │ │  • Quick answers │ │  • Strategy      │        │
│   │                  │ │  • GTD tasks     │ │  • Correlations  │        │
│   └──────────────────┘ └──────────────────┘ └──────────────────┘        │
│                                                                           │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                     Auto-Escalation System                       │   │
│   │                                                                  │   │
│   │  If Worker response shows low confidence → Escalate to Thinker  │   │
│   │  If primary model fails → Fallback to backup model              │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## The Three Modules

### Module 1: Data Processor (Cleaner)

**Model:** Gemini 2.5 Flash
**Cost:** 1 Credit
**Speed:** Fastest

The Data Processor handles all file-related operations. When you upload a CSV, Excel, or JSON file, this module:

1. Reads the file headers and sample data
2. Detects data types (string, number, date, currency, percentage)
3. Creates a normalized schema mapping
4. Identifies potential data quality issues

**Example Use Cases:**
- Uploading a sales report CSV
- Importing customer data from Excel
- Processing JSON exports from other systems

**Input:**
```json
{
  "fileName": "sales_q4.csv",
  "headers": ["Item No", "Qty", "Unit Price", "Total Amt"],
  "sampleRows": [{"Item No": "SKU-001", "Qty": "10", "Unit Price": "$25.00"}]
}
```

**Output:**
```json
{
  "mappedSchema": {
    "Item No": "itemCode",
    "Qty": "quantity",
    "Unit Price": "unitPrice",
    "Total Amt": "totalAmount"
  },
  "dataTypes": {
    "itemCode": "string",
    "quantity": "number",
    "unitPrice": "currency",
    "totalAmount": "currency"
  }
}
```

---

### Module 2: Intelligence Engine (Worker)

**Model:** Gemini 3 Flash
**Cost:** 1 Credit
**Speed:** Fast

The Intelligence Engine handles 90% of all requests. It's optimized for common business tasks that need quick, accurate responses.

**Capabilities:**
- Chart generation (bar, line, pie, area, radar, funnel)
- Table creation and transformation
- GTD task extraction
- Quick data analysis
- General Q&A

**Example: Chart Generation**
```
User: "Create a bar chart showing sales by region"

NABD Brain automatically:
1. Routes to Intelligence Engine (fast, 1 credit)
2. Analyzes your data structure
3. Generates ECharts configuration
4. Returns ready-to-render JSON
```

**Example: Task Extraction**
```
User: "Extract tasks from: Need to call John about the proposal by Friday,
       then review the contract and send feedback to legal team"

Output:
- "Call John about proposal" (Priority: High, Due: Friday)
- "Review contract" (Priority: Medium)
- "Send feedback to legal team" (Priority: Medium, Category: Waiting For)
```

---

### Module 3: Strategic Advisor (Thinker)

**Model:** Gemini 3 Pro
**Cost:** 5 Credits
**Speed:** Thorough (takes longer, but more comprehensive)

The Strategic Advisor handles complex analysis that requires deep reasoning. It's automatically selected for:

- Multi-department analysis
- Forecasting with confidence intervals
- Strategic recommendations
- Risk assessment
- Correlation analysis
- Scenario planning

**Automatic Triggers:**

The system automatically uses the Strategic Advisor when it detects:

| Pattern | Example |
|---------|---------|
| Cross-department | "Compare performance across all departments" |
| Forecasting | "Predict Q4 revenue based on trends" |
| Strategic | "What strategic changes should we make?" |
| Correlation | "Find correlations between marketing spend and sales" |
| Comprehensive | "Provide a comprehensive audit of our operations" |
| Risk | "Assess the risks of this expansion plan" |

**Example: Forecasting**
```
User: "Forecast next quarter's revenue"

Output:
{
  "predictions": [
    {"period": "Q1 2024", "value": 125000, "confidence": 0.85},
    {"period": "Q2 2024", "value": 142000, "confidence": 0.78}
  ],
  "trend": "up",
  "insights": [
    "15% growth trajectory based on last 4 quarters",
    "Seasonal peak expected in Q2",
    "Risk: Economic uncertainty may impact Q2 confidence"
  ],
  "methodology": "Linear regression with seasonal adjustment"
}
```

---

## How Smart Routing Works

### Step 1: Complexity Analysis

When you send a prompt, NABD Brain analyzes it using 30+ pattern detectors:

```typescript
// High complexity patterns (→ Strategic Advisor)
"analyze trends across departments"    // Score: +30
"predict Q4 revenue risk"              // Score: +30
"comprehensive audit"                  // Score: +30
"strategic recommendations"            // Score: +30

// Medium complexity patterns (→ Intelligence Engine)
"create a bar chart"                   // Score: +15
"list top customers"                   // Score: +15
"calculate total sales"                // Score: +15

// Data context also affects scoring
Large dataset (10,000+ rows)           // Score: +20
Wide table (30+ columns)               // Score: +15
Multiple questions in prompt           // Score: +5 per question
```

### Step 2: Module Selection

Based on the complexity score:

| Score | Module | Cost |
|-------|--------|------|
| 0-19 | Intelligence Engine | 1 credit |
| 20-49 | Intelligence Engine | 1 credit |
| 50+ | Strategic Advisor | 5 credits |
| File Upload | Data Processor | 1 credit |
| Deep Mode ON | Strategic Advisor | 5 credits |

### Step 3: Auto-Escalation

If the Intelligence Engine responds with uncertainty:

```
"I'm not sure about this..."
"This is too complex to determine..."
"I need more context..."
```

NABD Brain automatically escalates to the Strategic Advisor (if you have enough credits).

### Step 4: Fallback Protection

If a model fails (API error, timeout, etc.):

| Primary Model | Fallback Model |
|--------------|----------------|
| Gemini 2.5 Flash | Gemini 2.0 Flash |
| Gemini 3 Flash | Gemini 2.0 Flash |
| Gemini 3 Pro | Gemini 2.5 Flash |

---

## Credit System

### How Credits Work

Every user starts with **100 credits**. Credits are deducted after successful AI operations:

| Operation | Credits |
|-----------|---------|
| File upload/mapping | 1 |
| Chart generation | 1 (or 5 in Deep Mode) |
| Table generation | 1 (or 5 in Deep Mode) |
| Task extraction | 1 |
| Tips generation | 1 (or 5 in Deep Mode) |
| Deep analysis | 5 |
| Forecasting | 5 |

### Checking Your Balance

**API:**
```bash
GET /api/ai/credits
→ { "credits": 95 }
```

**Frontend:**
```tsx
const { credits } = useAI();
console.log(credits); // 95
```

### Adding Credits

```bash
POST /api/ai/credits/add
{ "amount": 100 }
→ { "credits": 195, "added": 100 }
```

### Usage Analytics

Track your AI usage over time:

```bash
GET /api/ai/usage?startDate=2024-01-01

Response:
{
  "totalRequests": 150,
  "totalCreditsUsed": 200,
  "byTier": {
    "cleaner": 20,
    "worker": 120,
    "thinker": 10
  },
  "byType": {
    "chart": 50,
    "analysis": 30,
    "gtd": 40,
    "tips": 30
  },
  "successRate": 0.95
}
```

---

## API Reference

### Core Endpoints

#### POST /api/ai/process
Main endpoint - automatically routes to the appropriate module.

```json
Request:
{
  "prompt": "Create a pie chart of sales by category",
  "promptType": "chart",
  "forceDeepMode": false,
  "context": {
    "department": "Sales"
  }
}

Response:
{
  "success": true,
  "content": "...",
  "tier": "worker",
  "creditsUsed": 1,
  "metadata": {
    "model": "gemini-3.0-flash",
    "confidence": 0.85,
    "processingTime": 1250
  }
}
```

#### POST /api/ai/chart
Generate chart configurations.

```json
Request:
{
  "prompt": "Show monthly revenue trend",
  "data": [
    {"month": "Jan", "revenue": 10000},
    {"month": "Feb", "revenue": 12000}
  ],
  "deepMode": false
}

Response:
{
  "success": true,
  "chartConfig": { /* ECharts option object */ },
  "chartType": "line",
  "insights": ["Revenue grew 20% from Jan to Feb"]
}
```

#### POST /api/ai/table
Generate data tables.

```json
Request:
{
  "prompt": "Top 10 customers by revenue",
  "data": [...],
  "deepMode": false
}

Response:
{
  "success": true,
  "tableData": {
    "columns": [
      {"key": "customer", "label": "Customer", "type": "string"},
      {"key": "revenue", "label": "Revenue", "type": "currency"}
    ],
    "rows": [...],
    "summary": "Top 10 customers represent 60% of total revenue"
  }
}
```

#### POST /api/ai/forecast
Generate predictions (always uses Strategic Advisor).

```json
Request:
{
  "prompt": "Forecast next 6 months",
  "data": [
    {"period": "Jan", "value": 100},
    {"period": "Feb", "value": 120}
  ],
  "periods": 6
}

Response:
{
  "success": true,
  "forecast": {
    "predictions": [
      {"period": "Mar", "value": 135, "confidence": 0.88}
    ],
    "trend": "up",
    "insights": ["Strong upward momentum"],
    "methodology": "Linear regression"
  }
}
```

#### POST /api/ai/gtd
Extract GTD tasks from text.

```json
Request:
{
  "input": "Need to review the proposal by Friday and send to John"
}

Response:
{
  "success": true,
  "tasks": [
    {
      "title": "Review the proposal",
      "priority": "high",
      "dueDate": "2024-01-26",
      "category": "next_action"
    },
    {
      "title": "Send proposal to John",
      "priority": "medium",
      "category": "waiting_for"
    }
  ]
}
```

#### POST /api/ai/tips
Generate actionable recommendations.

```json
Request:
{
  "context": {
    "department": "Sales",
    "boardData": {"name": "Q4 Pipeline", "taskCount": 45}
  },
  "focusArea": "conversion"
}

Response:
{
  "success": true,
  "tips": [
    {
      "category": "Pipeline",
      "priority": "high",
      "title": "Focus on mid-stage deals",
      "description": "45 deals in pipeline, 60% stuck in negotiation",
      "actionItems": [
        "Review deals older than 30 days",
        "Schedule follow-up calls"
      ]
    }
  ]
}
```

#### POST /api/ai/analyze
Deep analysis (always uses Strategic Advisor).

```json
Request:
{
  "prompt": "Analyze our Q4 performance and identify areas for improvement",
  "context": {
    "department": "Executive"
  }
}

Response:
{
  "success": true,
  "content": "## Q4 Performance Analysis\n\n...",
  "tier": "thinker",
  "creditsUsed": 5
}
```

#### POST /api/ai/upload
Process file uploads.

```json
Request:
{
  "fileName": "customers.csv",
  "headers": ["Name", "Email", "Revenue"],
  "sampleRows": [...],
  "fileType": "csv"
}

Response:
{
  "success": true,
  "mapping": {
    "originalSchema": {...},
    "mappedSchema": {...},
    "dataTypes": {...}
  },
  "summary": "Processed 3 columns"
}
```

### Utility Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/ai/credits` | GET | Get current balance |
| `/api/ai/credits/add` | POST | Add credits |
| `/api/ai/usage` | GET | Get usage statistics |
| `/api/ai/tier-preview` | POST | Preview which module will be used |
| `/api/ai/complexity` | POST | Analyze prompt complexity |

---

## Frontend Integration

### Setup

Wrap your app with the AIProvider:

```tsx
// App.tsx
import { AIProvider } from '@/contexts/AIContext';

function App() {
  return (
    <AIProvider>
      <YourApp />
    </AIProvider>
  );
}
```

### Using the AI Hook

```tsx
import { useAI } from '@/contexts/AIContext';

function MyComponent() {
  const {
    // Credits
    credits,
    creditsLoading,
    refreshCredits,

    // Mode
    deepModeEnabled,
    toggleDeepMode,

    // Context
    userDepartment,
    setUserDepartment,
    setCurrentBoardContext,
    setCurrentRoomContext,

    // State
    isProcessing,
    currentTier,
    error,
    clearError,

    // Methods
    processPrompt,
    generateChart,
    generateTable,
    generateForecast,
    generateTips,
    extractGTDTasks,
    uploadFile,
    analyzeDeep,
    previewTier,
    analyzeComplexity,
    getUsageStats,
  } = useAI();

  // Example: Generate a chart
  const handleGenerateChart = async () => {
    const result = await generateChart(
      "Show sales by region",
      myData
    );

    if (result.success) {
      setChartConfig(result.chartConfig);
    }
  };

  return (
    <div>
      <p>Credits: {credits}</p>
      <button onClick={toggleDeepMode}>
        {deepModeEnabled ? 'Deep Mode ON' : 'Fast Mode'}
      </button>
      <button onClick={handleGenerateChart} disabled={isProcessing}>
        Generate Chart
      </button>
    </div>
  );
}
```

### Setting Context

For better results, always set the user's context:

```tsx
// Set department for department-specific insights
setUserDepartment('Sales');

// Set current board context
setCurrentBoardContext({
  id: 'board-123',
  name: 'Q4 Sales Pipeline',
  columns: ['Name', 'Status', 'Value', 'Owner'],
  taskCount: 45,
});

// Set current table/room context
setCurrentRoomContext({
  id: 'room-456',
  name: 'Customer Data',
  columns: ['Name', 'Email', 'Revenue', 'Status'],
  rowCount: 1500,
});
```

### Using the AI Chat Component

```tsx
import { AIChat } from '@/components/AIChat';

function Dashboard() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <button onClick={() => setChatOpen(true)}>
        Open NABD Brain
      </button>

      <AIChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialPrompt="Analyze my Q4 performance"
      />
    </>
  );
}
```

### Preview Before Processing

Show users the expected cost before processing:

```tsx
const { previewTier } = useAI();

const handleInputChange = async (text) => {
  setInput(text);

  if (text.length > 10) {
    const preview = await previewTier(text);
    setPreview({
      model: preview.model,      // "Gemini 3 Flash"
      cost: preview.creditCost,  // 1
      tier: preview.tier,        // "worker"
    });
  }
};
```

---

## Configuration

### Environment Variables

**Backend (`server/.env`):**
```bash
# Required
GEMINI_API_KEY=your_google_ai_api_key

# Database
DATABASE_URL=postgresql://...
```

**Frontend (`.env`):**
```bash
VITE_API_URL=http://localhost:3001
```

### Database Setup

Run the Prisma migration:

```bash
cd server
npx prisma db push
```

This creates:
- `aiCreditsBalance` field on User (default: 100)
- `FileMapping` table for schema mappings
- `AIUsageLog` table for analytics

### Model Configuration

The models are configured in `aiRouterService.ts`:

```typescript
const MODEL_CONFIG = {
  cleaner: 'gemini-2.5-flash-preview-05-20',
  worker: 'gemini-2.5-flash-preview-05-20',   // Update to Gemini 3 Flash when available
  thinker: 'gemini-2.5-pro-preview-06-05',    // Update to Gemini 3 Pro when available
};

const FALLBACK_MODELS = {
  cleaner: 'gemini-2.0-flash',
  worker: 'gemini-2.0-flash',
  thinker: 'gemini-2.5-flash-preview-05-20',
};
```

---

## Best Practices

### 1. Use Fast Mode by Default

Deep Mode (Strategic Advisor) costs 5x more. Only use it for:
- Complex strategic decisions
- Multi-department analysis
- Forecasting
- When Fast Mode gives uncertain results

### 2. Set Department Context

Always set the user's department for better results:

```tsx
setUserDepartment('Finance');
```

This adds department-specific guidance:
- Finance → Focus on ROI, cash flow, compliance
- Sales → Focus on pipeline, conversion, CAC
- HR → Focus on retention, engagement, training

### 3. Provide Data Context

When generating charts or tables, provide sample data:

```tsx
// Good - provides context
generateChart("Show sales trend", salesData);

// Less optimal - no context
processPrompt("Show me the sales trend");
```

### 4. Preview Costs

Before expensive operations, show users the expected cost:

```tsx
const preview = await previewTier(userInput);
// "This will use Gemini 3 Pro (5 credits)"
```

### 5. Handle Errors Gracefully

```tsx
const result = await generateChart(prompt, data);

if (!result.success) {
  // Show user-friendly error
  showError(result.error);
} else {
  // Use the chart
  setChart(result.chartConfig);
}
```

### 6. Monitor Usage

Regularly check usage patterns to optimize costs:

```tsx
const stats = await getUsageStats(startOfMonth, endOfMonth);
// Review which operations use the most credits
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "GEMINI_API_KEY is not configured" | Missing environment variable | Add `GEMINI_API_KEY` to `server/.env` |
| "Insufficient credits" | Balance too low | Add credits via `/api/ai/credits/add` |
| Slow responses | Using Strategic Advisor | Enable Fast Mode for quicker results |
| "Model not available" | API quota exceeded | Wait 1 minute, system will use fallback |
| Empty responses | Large data payload | Reduce data sample size |
| JSON parse errors | AI returned invalid format | Retry the request |
| Credits show 0 | New user | Run: `UPDATE "User" SET "aiCreditsBalance" = 100;` |

### Debug Mode

Enable detailed logging by checking server console for:

```
[AIRouter] Complexity score: 45
[AIRouter] Selected tier: worker
[AIRouter] Model: gemini-3.0-flash
[AIRouter] Processing time: 1250ms
```

### Testing the API

```bash
# Test credits endpoint
curl http://localhost:3001/api/ai/credits \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test chart generation
curl -X POST http://localhost:3001/api/ai/chart \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Show sales trend", "data": [{"month": "Jan", "sales": 100}]}'
```

---

## Files Reference

| File | Description |
|------|-------------|
| `server/src/services/aiRouterService.ts` | Core brain logic, routing, credit management |
| `server/src/services/departmentPrompts.ts` | Department-specific prompt templates |
| `server/src/routes/aiRoutes.ts` | REST API endpoints |
| `src/contexts/AIContext.tsx` | React context and hooks |
| `src/components/AIChat.tsx` | Chat interface component |
| `src/components/AICreditsDisplay.tsx` | Credits display widget |
| `server/prisma/schema.prisma` | Database schema |

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2024-01-22 | Initial release |
| 2.0 | 2024-01-23 | Added Smart Router, Auto-Escalation, Table/Forecast/Tips |

---

*NABD Brain - Making AI work for your business.*
