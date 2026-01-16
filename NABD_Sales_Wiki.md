# 📘 NABD Chain System: Sales Module Wiki & Specification

**Version:** 1.0  
**Target Audience:** Small Business Owners (SME), Grocery (Baqala), Boutique Retail, E-commerce.  
**Tech Stack:** React, ECharts, NABD Framework.

---

## 🧭 Introduction
This document serves as both the **User Guide (Wiki)** and the **Technical Specification** for the Sales Module of the NABD Chain System. Our goal is to provide small business owners in Saudi Arabia with actionable insights similar to enterprise ERPs but with the simplicity of modern SaaS tools.

---

## 📊 Dashboard 1: The Executive Command
**"The Pulse of Your Business"**

### 📖 Wiki: Purpose & Benefits
This is the landing page for the business owner. It answers the single most important question: *"Did I make money today?"*
* **Benefit:** Eliminates the need to dig through reports. It provides an instant "Health Check" of the business.
* **Strategic Value:** Allows owners to spot daily anomalies (e.g., a sudden drop in sales) immediately and react.
* **For Who:** Business Owners, General Managers.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs (Instant Metrics)**
    1.  **Total Revenue (SAR):** (Value: Today vs Yesterday %).
    2.  **Net Profit:** (Revenue minus COGS).
    3.  **Total Orders:** (Count of distinct receipts).
    4.  **Average Basket Size (AOV):** (Revenue ÷ Orders).
    5.  **Gross Margin %:** (Profitability health).
    6.  **Items Sold:** (Total quantity).
    7.  **Returns Value:** (Lost revenue).
    8.  **Goal Progress:** (% of Monthly Target).

* **Row B: 4 Bar Charts (Trends)**
    1.  **Daily Revenue:** Last 30 Days (Simple bars).
    2.  **Sales by Channel:** Store vs. Web vs. Social.
    3.  **Top 5 Sales Reps:** Performance tracking.
    4.  **Sales vs. Target:** Actual vs. Goal (Grouped bars).

* **Row C: 4 Pie Charts (Composition)**
    1.  **Revenue by Category:** (Doughnut).
    2.  **Payment Method:** Cash/Mada/Visa/Tabby.
    3.  **Order Type:** Delivery vs. Pickup.
    4.  **New vs. Returning:** Customer mix.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'line'` (Area Style):** Revenue Trend with gradient fill.
    2.  **`type: 'gauge'`:** Monthly Target Meter (Green/Red zones).
    3.  **`type: 'heatmap'`:** Peak Hours (Day vs. Hour).
    4.  **`type: 'calendar'`:** Yearly Sales Heatmap (GitHub style).

---

## 📦 Dashboard 2: Product & Inventory Intelligence
**"The Stock Optimizer"**

### 📖 Wiki: Purpose & Benefits
High revenue doesn't matter if your cash is tied up in unsold inventory. This dashboard helps owners optimize their shelves.
* **Benefit:** Identifies "Dead Stock" (money wasted) and "Best Sellers" (money makers).
* **Strategic Value:** Improves cash flow by preventing over-ordering of bad products and stockouts of good ones.
* **For Who:** Procurement Officers, Store Managers.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs**
    1.  **Top Selling SKU:** (Name).
    2.  **Worst Selling SKU:** (Name).
    3.  **Inventory Turnover Ratio:** (Speed of sales).
    4.  **Stockout Count:** (Items at 0 qty).
    5.  **Dead Stock Value:** (Items unsold > 90 days).
    6.  **Best Selling Brand:** (Top vendor).
    7.  **Avg Product Cost:** (Inventory valuation).
    8.  **GMROI:** (Return on Inventory Investment).

* **Row B: 4 Bar Charts**
    1.  **Top 10 Products (Volume):** Qty sold.
    2.  **Top 10 Products (Profit):** Stacked Cost vs Margin.
    3.  **Stock vs. Velocity:** High stock low sales warning.
    4.  **Returns by Product:** Quality control check.

* **Row C: 4 Pie Charts**
    1.  **Stock Value by Category:** Where is cash tied up?
    2.  **Vendor Market Share:** Supplier dependency.
    3.  **Product Aging:** Fresh vs. Old stock.
    4.  **Sales Mix:** High margin vs. Low margin volume.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'treemap'`:** Category Hierarchy (Visual market share).
    2.  **`type: 'scatter'`:** Price vs. Volume Matrix.
    3.  **`type: 'radar'`:** Product Performance Score (5 metrics).
    4.  **`type: 'sunburst'`:** Multi-level Category Sales.

---

## 👥 Dashboard 3: Customer Insights & Loyalty
**"The Relationship Builder"**

### 📖 Wiki: Purpose & Benefits
Understanding who buys from you is key to modern retail. This dashboard focuses on retention.
* **Benefit:** Differentiates between "One-time shoppers" and "Loyal fans."
* **Strategic Value:** It is 5x cheaper to keep a customer than get a new one. This dashboard highlights where to focus retention efforts.
* **For Who:** Marketing Managers, CRM Users.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs**
    1.  **Total Distinct Customers:** (Database size).
    2.  **New Customers:** (This Month).
    3.  **Retention Rate %:** (Repeat buyers).
    4.  **Churn Rate:** (% lost).
    5.  **Avg Lifetime Value (LTV):** (Total spend per user).
    6.  **Top Customer:** (VIP Name).
    7.  **CAC:** (Cost to acquire one customer).
    8.  **Loyalty Points Redeemed:** (Program engagement).

* **Row B: 4 Bar Charts**
    1.  **Customer Age Groups:** Demographics.
    2.  **Sales by Gender:** Demographics.
    3.  **Acquisition Source:** Where did they come from?
    4.  **Purchase Frequency:** Histogram (1x, 2x, 5x+).

* **Row C: 4 Pie Charts**
    1.  **Customer Tier:** VIP/Regular/New.
    2.  **City Distribution:** Top locations.
    3.  **Coupon Usage:** Discount vs Full Price.
    4.  **Device Usage:** Mobile vs Desktop.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'sankey'`:** Customer Journey Flow.
    2.  **`type: 'map'` (KSA):** Geographic Customer Density.
    3.  **`type: 'funnel'`:** Conversion Funnel (Visit -> Buy).
    4.  **`type: 'graph'`:** Product Associations (People who bought X also bought Y).

---

## 📈 Dashboard 4: Sales Forecasting & Trends
**"The Future Outlook"**

### 📖 Wiki: Purpose & Benefits
Moves the business from "Reactive" (looking at the past) to "Proactive" (preparing for the future).
* **Benefit:** Uses historical data to predict next month's demand.
* **Strategic Value:** Helps in staff scheduling and cash flow planning before the month even starts.
* **For Who:** Planners, Financial Analysts.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs**
    1.  **Predicted Revenue:** (Next 30 Days).
    2.  **Predicted Orders:** (Next 30 Days).
    3.  **Growth Rate (MoM):** (Momentum).
    4.  **Seasonality Factor:** (Impact of time).
    5.  **Avg Days to Sell Out:** (Inventory runway).
    6.  **Cash Flow Forecast:** (Projected).
    7.  **Opportunity Loss:** (Missed sales).
    8.  **Trend Strength:** (Direction).

* **Row B: 4 Bar Charts**
    1.  **Actual vs. Forecast:** Accuracy check.
    2.  **YoY Growth:** This year vs Last year.
    3.  **Quarterly Performance:** Q1/Q2/Q3/Q4.
    4.  **Gap to Goal:** Waterfall chart.

* **Row C: 4 Pie Charts**
    1.  **Forecast Confidence:** High/Med/Low.
    2.  **Seasonal Contribution:** Ramadan vs Regular.
    3.  **Growth Drivers:** New items vs Price.
    4.  **Risk Factors:** Economy/Competitors.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'line'` (MarkArea):** Predictive Line with confidence band.
    2.  **`type: 'candlestick'`:** Sales Volatility (High/Low/Open/Close).
    3.  **`type: 'themeRiver'`:** Changing category trends over time.
    4.  **`type: 'bar'` (Race):** Animated product race over time.

---

## 🌍 Dashboard 5: Regional & Branch Performance
**"The Expansion Manager"**

### 📖 Wiki: Purpose & Benefits
For businesses with more than one physical location or shipping nationwide.
* **Benefit:** Compares performance "Apples to Apples" across different branches.
* **Strategic Value:** Identifies which branch is the "Model" to copy and which is the "Problem" to fix.
* **For Who:** Area Managers, Operations Directors.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs**
    1.  **Top Branch Revenue:** (Best performer).
    2.  **Lowest Branch Revenue:** (Needs help).
    3.  **Total Delivery Cost:** (Logistics expense).
    4.  **Avg Delivery Time:** (Speed).
    5.  **Return Rate by Region:** (Quality issues?).
    6.  **Sales Per Employee:** (Staff efficiency).
    7.  **Branch Ops Cost:** (Rent/Utilities).
    8.  **Net Profit by Region:** (True value).

* **Row B: 4 Bar Charts**
    1.  **Revenue by Branch:** Comparison.
    2.  **Profit Margin by Branch:** Efficiency.
    3.  **Delivery Time by City:** Logistics check.
    4.  **CSAT Score:** Customer Satisfaction per branch.

* **Row C: 4 Pie Charts**
    1.  **Revenue Share by Region:** Market penetration.
    2.  **Order Volume by Zone:** Logistics load.
    3.  **Local vs. Shipping:** Fulfillment type.
    4.  **Branch Size Class:** Small/Med/Large.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'map'` (Pin):** Order location pins.
    2.  **`type: 'bar3D'`:** 3D City Sales Map.
    3.  **`type: 'parallel'`:** Branch Multi-variable comparison.
    4.  **`type: 'scatter'` (Bubble):** Branch Matrix (Size vs Sales vs Profit).

---

## ⚙️ Dashboard 6: Sales Operations
**"The Engine Room"**

### 📖 Wiki: Purpose & Benefits
Focuses on the *process* of selling, not just the result. Critical for B2B or high-volume e-commerce.
* **Benefit:** Finds bottlenecks in the warehouse or sales team.
* **Strategic Value:** Speed equals Customer Satisfaction. Faster processing means faster cash collection.
* **For Who:** Warehouse Managers, Sales Team Leads.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs**
    1.  **Open Orders:** (Backlog).
    2.  **Orders to Ship:** (Immediate action).
    3.  **Avg Processing Time:** (Speed).
    4.  **Late Orders:** (Alert).
    5.  **Quotes Sent:** (B2B Pipeline).
    6.  **Quote Conversion:** (Success rate).
    7.  **Pending Payments:** (Accounts Receivable).
    8.  **Order Accuracy:** (Error rate).

* **Row B: 4 Bar Charts**
    1.  **Orders by Status:** Pending/Shipped/Done.
    2.  **Processing by User:** Staff performance.
    3.  **Daily Volume:** Workload.
    4.  **Payment Speed:** Collection time.

* **Row C: 4 Pie Charts**
    1.  **Return Reasons:** Analysis.
    2.  **Carrier Share:** SMSA/Aramex/SPL.
    3.  **Payment Status:** Paid/Unpaid.
    4.  **Order Source:** App/Web/Call.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'gauge'` (Multi):** Speedometers for Picking/Packing/Shipping.
    2.  **`type: 'funnel'`:** Order Pipeline Flow.
    3.  **`type: 'boxplot'`:** Delivery Time Variance.
    4.  **`type: 'lines'`:** Route/Logistics Flow.

---

## 💰 Dashboard 7: Profitability & Finance
**"The Bottom Line"**

### 📖 Wiki: Purpose & Benefits
Revenue is vanity, profit is sanity. This connects sales data directly to financial health.
* **Benefit:** Reveals the true costs hidden behind sales (Taxes, Discounts, COGS).
* **Strategic Value:** Ensures the business is sustainable and not just "busy."
* **For Who:** CFO, Accountants, Owners.

### 🛠 Technical Specifications
**Layout:** Grid (4 Rows)

* **Row A: 8 KPIs**
    1.  **Total COGS:** (Cost of goods).
    2.  **Total Discounts:** (Margin leakage).
    3.  **Tax Collected:** (VAT 15%).
    4.  **Net Profit Margin %:** (The final score).
    5.  **Sales Ops Expenses:** (Marketing/Shipping costs).
    6.  **Break-even Point:** (Safety line).
    7.  **Cash on Hand:** (Liquidity).
    8.  **Unpaid Invoices:** (Debt).

* **Row B: 4 Bar Charts**
    1.  **Revenue vs Cost:** Stacked comparison.
    2.  **Discount Impact:** With vs Without offers.
    3.  **Profit by Category:** Which item makes us rich?
    4.  **Fixed Costs vs Sales:** Coverage.

* **Row C: 4 Pie Charts**
    1.  **Cost Breakdown:** Product/Ads/Ship/Tax.
    2.  **Profit Share by Channel:** Where is profit coming from?
    3.  **Taxable Sales:** VAT compliance.
    4.  **Expense Categories:** Ops breakdown.

* **Row D: 4 ECharts (Advanced)**
    1.  **`type: 'waterfall'`:** Profit Waterfall (Rev -> Net).
    2.  **`type: 'pie'` (Rose):** Cost Center Nightingale Rose.
    3.  **`type: 'line'` (Step):** Cash Balance Tracker.
    4.  **`type: 'bar'` (Pos/Neg):** Daily Profit/Loss Variance.

---