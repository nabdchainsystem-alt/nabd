# API Reference - NABD Brain

Complete API documentation for all NABD Brain endpoints.

---

## Authentication

All endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Base URL

```
http://localhost:3001/api/ai
```

---

## Core Endpoints

### POST /process

Main endpoint that automatically routes to the appropriate AI module.

**Request:**
```json
{
  "prompt": "Your request here",
  "promptType": "general|chart|table|gtd|analysis|forecast|tips",
  "forceDeepMode": false,
  "context": {
    "department": "Sales",
    "boardData": {
      "id": "board-123",
      "name": "Q4 Pipeline",
      "columns": ["Name", "Status"],
      "taskCount": 45
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "content": "AI response content",
  "tier": "worker",
  "creditsUsed": 1,
  "requestedTier": "worker",
  "complexityScore": 25,
  "complexityFactors": ["Medium complexity pattern: create.*chart"],
  "metadata": {
    "model": "gemini-3.0-flash",
    "confidence": 0.85,
    "processingTime": 1250,
    "escalated": false
  }
}
```

---

### POST /chart

Generate ECharts configuration from data.

**Request:**
```json
{
  "prompt": "Show monthly revenue trend with comparison to last year",
  "data": [
    {"month": "Jan", "revenue": 10000, "lastYear": 8000},
    {"month": "Feb", "revenue": 12000, "lastYear": 9500}
  ],
  "deepMode": false
}
```

**Response:**
```json
{
  "success": true,
  "chartConfig": {
    "title": {"text": "Monthly Revenue Comparison"},
    "xAxis": {"type": "category", "data": ["Jan", "Feb"]},
    "yAxis": {"type": "value"},
    "series": [
      {"name": "This Year", "type": "bar", "data": [10000, 12000]},
      {"name": "Last Year", "type": "bar", "data": [8000, 9500]}
    ]
  },
  "chartType": "bar",
  "insights": [
    "Revenue increased 25% in January YoY",
    "February shows 26% growth compared to last year"
  ]
}
```

---

### POST /table

Generate structured data tables.

**Request:**
```json
{
  "prompt": "Top 5 customers by revenue with growth rate",
  "data": [
    {"customer": "Acme Corp", "revenue": 50000, "lastYear": 40000},
    {"customer": "TechStart", "revenue": 35000, "lastYear": 30000}
  ],
  "deepMode": false
}
```

**Response:**
```json
{
  "success": true,
  "tableData": {
    "columns": [
      {"key": "rank", "label": "#", "type": "number"},
      {"key": "customer", "label": "Customer", "type": "string"},
      {"key": "revenue", "label": "Revenue", "type": "currency"},
      {"key": "growth", "label": "Growth", "type": "percentage"}
    ],
    "rows": [
      {"rank": 1, "customer": "Acme Corp", "revenue": 50000, "growth": 25},
      {"rank": 2, "customer": "TechStart", "revenue": 35000, "growth": 16.7}
    ],
    "summary": "Top 5 customers represent 65% of total revenue"
  }
}
```

---

### POST /forecast

Generate predictive forecasts (always uses Strategic Advisor - 5 credits).

**Request:**
```json
{
  "prompt": "Forecast Q1 2024 revenue based on historical data",
  "data": [
    {"period": "Q1 2023", "revenue": 100000},
    {"period": "Q2 2023", "revenue": 120000},
    {"period": "Q3 2023", "revenue": 115000},
    {"period": "Q4 2023", "revenue": 140000}
  ],
  "periods": 4
}
```

**Response:**
```json
{
  "success": true,
  "forecast": {
    "predictions": [
      {"period": "Q1 2024", "value": 145000, "confidence": 0.85},
      {"period": "Q2 2024", "value": 160000, "confidence": 0.78},
      {"period": "Q3 2024", "value": 155000, "confidence": 0.72},
      {"period": "Q4 2024", "value": 175000, "confidence": 0.65}
    ],
    "trend": "up",
    "insights": [
      "Strong upward momentum with 15% average quarterly growth",
      "Q3 typically shows slight seasonal dip",
      "Q4 historically strongest quarter"
    ],
    "methodology": "Linear regression with seasonal adjustment",
    "assumptions": [
      "Market conditions remain stable",
      "No major economic disruptions"
    ],
    "risks": [
      "Economic uncertainty may impact Q4 confidence",
      "Seasonal patterns may shift"
    ]
  }
}
```

---

### POST /gtd

Extract GTD (Getting Things Done) tasks from natural language.

**Request:**
```json
{
  "input": "I need to call John about the proposal by Friday, then review the contract and send feedback to the legal team. Also, remind me to check on the marketing campaign next week.",
  "context": {
    "department": "Sales"
  }
}
```

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "title": "Call John about the proposal",
      "description": "Discuss proposal details",
      "priority": "high",
      "dueDate": "2024-01-26",
      "category": "next_action",
      "subtasks": []
    },
    {
      "title": "Review the contract",
      "priority": "medium",
      "category": "next_action",
      "subtasks": ["Read through all terms", "Note any concerns"]
    },
    {
      "title": "Send feedback to legal team",
      "priority": "medium",
      "category": "waiting_for",
      "subtasks": []
    },
    {
      "title": "Check on marketing campaign",
      "priority": "low",
      "dueDate": "2024-02-02",
      "category": "someday",
      "subtasks": []
    }
  ]
}
```

---

### POST /tips

Generate actionable recommendations based on context.

**Request:**
```json
{
  "context": {
    "department": "Sales",
    "boardData": {
      "name": "Q4 Pipeline",
      "taskCount": 45
    },
    "roomData": {
      "name": "Deals",
      "rowCount": 120
    }
  },
  "focusArea": "conversion rate"
}
```

**Response:**
```json
{
  "success": true,
  "tips": [
    {
      "category": "Pipeline Optimization",
      "priority": "high",
      "title": "Focus on mid-stage deals",
      "description": "With 45 tasks in your pipeline, prioritize deals in the negotiation stage that have been stagnant for over 2 weeks.",
      "actionItems": [
        "Review all deals older than 14 days",
        "Schedule follow-up calls for top 10 opportunities",
        "Identify and remove dead deals"
      ]
    },
    {
      "category": "Data Quality",
      "priority": "medium",
      "title": "Update deal stages",
      "description": "Ensure all 120 deals have accurate stage information for better forecasting.",
      "actionItems": [
        "Audit deals with no activity in 30 days",
        "Update probability estimates"
      ]
    }
  ]
}
```

---

### POST /analyze

Deep analysis endpoint (always uses Strategic Advisor - 5 credits).

**Request:**
```json
{
  "prompt": "Analyze our Q4 sales performance across all regions and identify the top 3 areas for improvement",
  "context": {
    "department": "Executive",
    "boardData": {
      "name": "Regional Sales",
      "taskCount": 150
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "content": "## Q4 Sales Performance Analysis\n\n### Executive Summary\n...",
  "tier": "thinker",
  "creditsUsed": 5,
  "metadata": {
    "model": "gemini-3.0-pro",
    "confidence": 0.92,
    "processingTime": 3500
  }
}
```

---

### POST /upload

Process file uploads for schema mapping.

**Request:**
```json
{
  "fileName": "sales_data_q4.csv",
  "headers": ["Customer ID", "Cust Name", "Qty Sold", "Unit Price", "Total Amt", "Sale Date"],
  "sampleRows": [
    {"Customer ID": "C001", "Cust Name": "Acme Corp", "Qty Sold": "10", "Unit Price": "$25.00", "Total Amt": "$250.00", "Sale Date": "2024-01-15"}
  ],
  "fileType": "csv"
}
```

**Response:**
```json
{
  "success": true,
  "mapping": {
    "originalSchema": {
      "Customer ID": "Unique customer identifier",
      "Cust Name": "Customer company name",
      "Qty Sold": "Quantity of items sold",
      "Unit Price": "Price per unit",
      "Total Amt": "Total transaction amount",
      "Sale Date": "Date of sale"
    },
    "mappedSchema": {
      "Customer ID": "customerId",
      "Cust Name": "customerName",
      "Qty Sold": "quantity",
      "Unit Price": "unitPrice",
      "Total Amt": "totalAmount",
      "Sale Date": "saleDate"
    },
    "dataTypes": {
      "customerId": "string",
      "customerName": "string",
      "quantity": "number",
      "unitPrice": "currency",
      "totalAmount": "currency",
      "saleDate": "date"
    }
  },
  "summary": "Processed 6 columns from sales_data_q4.csv"
}
```

---

## Utility Endpoints

### GET /credits

Get the current user's credit balance.

**Response:**
```json
{
  "credits": 95
}
```

---

### POST /credits/add

Add credits to user's balance.

**Request:**
```json
{
  "amount": 100
}
```

**Response:**
```json
{
  "credits": 195,
  "added": 100
}
```

---

### GET /usage

Get usage statistics for analytics.

**Query Parameters:**
- `startDate` (optional): ISO date string
- `endDate` (optional): ISO date string

**Response:**
```json
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
    "tips": 20,
    "upload": 10
  },
  "successRate": 0.95
}
```

---

### POST /tier-preview

Preview which tier/module will be used without charging credits.

**Request:**
```json
{
  "prompt": "Analyze trends across all departments and predict Q1 risks",
  "context": {
    "department": "Executive"
  },
  "forceDeepMode": false
}
```

**Response:**
```json
{
  "tier": "thinker",
  "creditCost": 5,
  "model": "Gemini 3 Pro",
  "complexity": {
    "score": 65,
    "confidence": 0.88,
    "factors": [
      "High complexity pattern: analyze.*trend",
      "High complexity pattern: predict.*risk",
      "High complexity keyword: strategic"
    ]
  }
}
```

---

### POST /complexity

Analyze prompt complexity without processing.

**Request:**
```json
{
  "prompt": "Create a simple bar chart of monthly sales",
  "context": {}
}
```

**Response:**
```json
{
  "score": 15,
  "tier": "worker",
  "confidence": 0.85,
  "factors": [
    "Medium complexity pattern: create.*chart"
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "tier": "worker",
  "creditsUsed": 0
}
```

### Common Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 401 | Unauthorized | Missing or invalid auth token |
| 400 | Bad Request | Invalid request body |
| 402 | Insufficient Credits | Not enough credits for operation |
| 500 | Server Error | Internal processing error |

---

*For more details, see the [README](./README.md).*
