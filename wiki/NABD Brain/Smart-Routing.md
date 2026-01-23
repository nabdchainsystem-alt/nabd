# Smart Routing - How NABD Brain Works

Understanding how NABD Brain automatically selects the optimal AI module for each request.

---

## Overview

NABD Brain uses a **Smart Router** that analyzes every request and routes it to the most appropriate AI module. This ensures you get the best results at the lowest cost.

```
User Request
     │
     ▼
┌─────────────────┐
│  Smart Router   │
│                 │
│ • Analyze text  │
│ • Score complexity │
│ • Check context │
└────────┬────────┘
         │
    ┌────┴────┬────────────┐
    ▼         ▼            ▼
┌───────┐ ┌───────┐ ┌───────────┐
│Cleaner│ │Worker │ │ Thinker   │
│1 cred │ │1 cred │ │ 5 credits │
└───────┘ └───────┘ └───────────┘
```

---

## The Complexity Score

Every request receives a **complexity score** from 0-100. This score determines which module handles the request.

### Scoring Factors

| Factor | Score Impact |
|--------|-------------|
| High complexity pattern detected | +30 per pattern |
| High complexity keyword | +5 per keyword |
| Medium complexity pattern | +15 per pattern |
| Medium complexity keyword | +3 per keyword |
| Large dataset (10,000+ rows) | +20 |
| Wide table (30+ columns) | +15 |
| Long prompt (500+ chars) | +10 |
| Multiple questions | +5 per question |

### Module Selection

| Score Range | Module | Cost |
|-------------|--------|------|
| 0-49 | Intelligence Engine (Worker) | 1 credit |
| 50+ | Strategic Advisor (Thinker) | 5 credits |
| File upload | Data Processor (Cleaner) | 1 credit |
| Deep Mode ON | Strategic Advisor (Thinker) | 5 credits |

---

## Pattern Detection

### High Complexity Patterns (→ Thinker)

These patterns automatically route to the Strategic Advisor:

```
analyze.*trend          "Analyze the sales trend across regions"
predict.*risk           "Predict the risk of this investment"
cross.*department       "Compare performance cross-department"
strategic.*advice       "Give me strategic advice on expansion"
comprehensive.*audit    "Conduct a comprehensive audit"
compare.*all            "Compare all products performance"
forecast                "Forecast next quarter revenue"
correlation             "Find correlations in the data"
multi.*file             "Analyze data from multiple files"
q[1-4].*projection      "Q4 projection based on trends"
annual.*report          "Generate annual performance report"
root.*cause.*analysis   "Perform root cause analysis"
benchmark.*comparison   "Benchmark against industry"
scenario.*planning      "Help with scenario planning"
risk.*assessment        "Risk assessment for the project"
```

### Medium Complexity Patterns (→ Worker)

These patterns are handled by the Intelligence Engine:

```
create.*chart           "Create a bar chart"
generate.*graph         "Generate a sales graph"
generate.*report        "Generate a weekly report"
show.*data              "Show me the sales data"
compare.*two            "Compare these two products"
calculate.*total        "Calculate total revenue"
list.*top               "List top 10 customers"
group.*by               "Group sales by region"
filter.*where           "Filter where status is active"
sort.*by                "Sort by date descending"
```

### Keywords

**High complexity keywords:**
```
strategic, comprehensive, holistic, enterprise-wide,
cross-functional, long-term, predictive, diagnostic,
prescriptive, correlation, regression, sentiment,
anomaly, outlier, benchmark, competitive, market
```

**Medium complexity keywords:**
```
chart, graph, table, report, summary, list,
calculate, count, total, average, filter, sort
```

---

## Context-Based Scoring

The Smart Router also considers your data context:

### Board Context
```tsx
setCurrentBoardContext({
  taskCount: 15000  // Large board → +20 score
});
```

### Room/Table Context
```tsx
setCurrentRoomContext({
  rowCount: 5000,    // Medium dataset → +10 score
  columns: [...30]   // Wide table → +15 score
});
```

---

## Auto-Escalation

Sometimes the Intelligence Engine (Worker) may struggle with a request. When it responds with uncertainty indicators, NABD Brain automatically escalates to the Strategic Advisor.

### Escalation Triggers

The system looks for these phrases in Worker responses:

```
"I'm not sure..."
"I am not sure..."
"I cannot determine..."
"insufficient data..."
"need more context..."
"too complex..."
```

### Escalation Process

```
1. Worker processes request
2. Response analyzed for uncertainty
3. If uncertainty detected AND confidence < 60%:
   - Check if user has 5 credits
   - If yes: Re-process with Thinker
   - Charge 5 credits (not 1 + 5)
4. Return enhanced response
```

---

## Fallback Protection

If a model fails (API error, timeout, quota exceeded), the system automatically tries a fallback model:

| Primary Model | Fallback |
|--------------|----------|
| Gemini 2.5 Flash (Cleaner) | Gemini 2.0 Flash |
| Gemini 3 Flash (Worker) | Gemini 2.0 Flash |
| Gemini 3 Pro (Thinker) | Gemini 2.5 Flash |

### Retry Logic

```
Attempt 1: Primary model
   ↓ (if fails)
Wait 1 second
   ↓
Attempt 2: Primary model
   ↓ (if fails)
Wait 2 seconds
   ↓
Attempt 3: Primary model
   ↓ (if fails)
Wait 4 seconds
   ↓
Attempt 4: Fallback model
```

**No retry on:**
- `PERMISSION_DENIED`
- `INVALID_API_KEY`
- Quota exceeded errors

---

## Previewing the Route

You can preview which module will be used before processing:

```tsx
const { previewTier } = useAI();

const preview = await previewTier("Analyze trends across all departments");

console.log(preview);
// {
//   tier: "thinker",
//   creditCost: 5,
//   model: "Gemini 3 Pro",
//   complexity: {
//     score: 65,
//     confidence: 0.88,
//     factors: ["High complexity pattern: analyze.*trend"]
//   }
// }
```

---

## Forcing a Specific Module

### Force Strategic Advisor (Deep Mode)

```tsx
// Via toggle
const { toggleDeepMode } = useAI();
toggleDeepMode(); // Enable deep mode

// Via API
const result = await processPrompt(prompt, {
  forceDeepMode: true
});
```

### Force via Endpoint

Use specific endpoints to target modules:

| Endpoint | Module |
|----------|--------|
| `/api/ai/upload` | Always Cleaner |
| `/api/ai/forecast` | Always Thinker |
| `/api/ai/analyze` | Always Thinker |
| `/api/ai/chart` | Worker (or Thinker with deepMode) |

---

## Best Practices

### 1. Let the Router Decide

In most cases, trust the Smart Router. It's optimized for cost-performance balance.

### 2. Use Deep Mode Only When Needed

Deep Mode costs 5x more. Reserve it for:
- Complex strategic analysis
- Multi-department correlations
- When you need high confidence forecasts

### 3. Check the Preview

Before expensive operations, show users what they'll be charged:

```tsx
const preview = await previewTier(userInput);
if (preview.creditCost > 1) {
  showConfirmation(`This will use ${preview.creditCost} credits`);
}
```

### 4. Provide Context

More context = better routing decisions:

```tsx
setUserDepartment('Sales');
setCurrentBoardContext({...});
setCurrentRoomContext({...});
```

---

*For API details, see [API Reference](./API-Reference.md).*
