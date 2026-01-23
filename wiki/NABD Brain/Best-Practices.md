# Best Practices - NABD Brain

Optimize your usage of NABD Brain for better results and cost efficiency.

---

## Prompt Engineering

### Be Specific

```typescript
// BAD - Vague prompt
"Show me sales data"

// GOOD - Specific prompt
"Create a bar chart comparing Q4 2024 sales by region, highlighting the top 3 performers"
```

### Include Context

```typescript
// BAD - No context
"What should we do?"

// GOOD - Context-rich prompt
"Given our 15% drop in customer retention this quarter, what strategies should we implement to improve loyalty?"
```

### Specify Output Format

```typescript
// Request specific formats when needed
"Generate a table with columns: Product, Revenue, Growth %, Trend"
"Create a pie chart showing market share percentages"
"Extract action items as GTD tasks with due dates"
```

---

## Mode Selection

### Use Fast Mode For:

- Quick data formatting and cleanup
- Simple chart generation
- Basic table creation
- Routine data extraction
- High-volume, low-complexity tasks

### Use Deep Mode For:

- Strategic analysis and recommendations
- Multi-factor forecasting
- Complex pattern recognition
- Cross-departmental insights
- Critical business decisions

### Auto Mode (Recommended)

Let NABD Brain automatically detect complexity:

```typescript
// The system analyzes your prompt and routes appropriately
const result = await processPrompt(prompt, data, 'auto');
```

---

## Credit Management

### Monitor Usage

```typescript
// Check credits before expensive operations
const { credits } = useAI();
if (credits < 5) {
  alert('Low credits - consider using Fast Mode');
}
```

### Cost-Effective Patterns

| Action | Cost | When to Use |
|--------|------|-------------|
| Simple chart | 1 credit | Data visualization |
| Table generation | 1 credit | Data formatting |
| Quick tips | 1 credit | Fast insights |
| Deep analysis | 5 credits | Strategic decisions |
| Forecasting | 1-5 credits | Planning (varies by complexity) |

### Batch Similar Requests

```typescript
// BAD - Multiple calls
await generateChart("Sales Q1", dataQ1);
await generateChart("Sales Q2", dataQ2);
await generateChart("Sales Q3", dataQ3);

// GOOD - Single comprehensive request
await generateChart("Quarterly sales comparison Q1-Q3", allQuarterData);
```

---

## Data Quality

### Clean Your Data First

NABD Brain works best with clean, structured data:

```typescript
// Good data structure
const data = [
  { date: "2024-01-15", category: "Sales", value: 15000 },
  { date: "2024-01-16", category: "Sales", value: 17500 },
  // ...
];

// Avoid mixed types and missing values
```

### Provide Column Context

When uploading files, the schema detection works better with:
- Clear column headers
- Consistent data types
- No merged cells (in spreadsheets)
- ISO date formats (YYYY-MM-DD)

---

## Department-Specific Tips

### Sales Department

```typescript
// Include relevant metrics
await processPrompt(
  "Analyze pipeline health and forecast close rates",
  { opportunities, historicalCloseRates, seasonalFactors },
  'auto',
  'sales'
);
```

### Finance Department

```typescript
// Request specific financial outputs
await generateTable(
  "Create P&L summary with variance analysis",
  financialData,
  'finance'
);
```

### Operations Department

```typescript
// Focus on actionable insights
await generateTips(
  productionData,
  'operations',
  'efficiency'
);
```

---

## Performance Optimization

### Use Caching

NABD Brain caches context for 15 minutes. Structure related requests together:

```typescript
// These requests share cached context
await processPrompt("Analyze current inventory", data);
await processPrompt("Suggest reorder points", data);  // Faster - uses cache
await processPrompt("Identify slow-moving items", data);  // Faster - uses cache
```

### Limit Data Size

For better performance, filter data before sending:

```typescript
// BAD - Send everything
await processPrompt(prompt, entireDatabase);

// GOOD - Filter first
const relevantData = data.filter(d => d.year === 2024);
await processPrompt(prompt, relevantData);
```

---

## Error Handling

### Implement Retries

NABD Brain has built-in retry logic, but handle errors gracefully:

```typescript
try {
  const result = await generateChart(prompt, data);
  // Use result
} catch (error) {
  if (error.message.includes('INSUFFICIENT_CREDITS')) {
    // Prompt user to add credits
  } else {
    // Show user-friendly error message
  }
}
```

### Fallback Strategies

```typescript
// Try deep analysis first, fall back to quick mode
try {
  const result = await analyzeDeep(prompt, data);
  return result;
} catch {
  // Fallback to simpler analysis
  return await processPrompt(prompt, data, 'fast');
}
```

---

## Security Considerations

### Sensitive Data

- Never include passwords, API keys, or secrets in prompts
- Be cautious with PII (personally identifiable information)
- Use data aggregation when possible instead of individual records

### Audit Trail

All AI usage is logged. Use meaningful prompts for audit purposes:

```typescript
// BAD - Unclear purpose
"Do the thing"

// GOOD - Clear and auditable
"Generate Q4 sales forecast for board presentation"
```

---

## Common Patterns

### Dashboard Insights

```typescript
// Generate multiple insights at once
const insights = await generateTips(
  dashboardData,
  department,
  'comprehensive'
);
```

### Report Generation

```typescript
// Combine multiple outputs
const chart = await generateChart("Revenue trend", data);
const table = await generateTable("Revenue breakdown", data);
const analysis = await processPrompt("Executive summary", data, 'deep');

const report = { chart, table, analysis };
```

### Task Extraction

```typescript
// Convert meeting notes to tasks
const tasks = await extractGTDTasks(
  "Meeting notes: Discussed Q1 launch, need to finalize pricing by Friday,
   assign marketing team to create assets, schedule follow-up for next week"
);
// Returns structured GTD tasks with dates and priorities
```

---

*For more details, see the [API Reference](./API-Reference.md) or [Smart Routing](./Smart-Routing.md) documentation.*
