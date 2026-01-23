# Troubleshooting - NABD Brain

Common issues and their solutions when working with NABD Brain.

---

## Quick Diagnostics

Before diving into specific issues, check these first:

```bash
# 1. Verify API key is set
echo $GEMINI_API_KEY  # Should not be empty

# 2. Check server is running
curl http://localhost:3001/health

# 3. Test AI endpoint
curl http://localhost:3001/api/ai/credits \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Common Issues

### "INSUFFICIENT_CREDITS" Error

**Symptom**: Requests fail with credit-related error message.

**Causes & Solutions**:

1. **Out of credits**
   ```typescript
   // Check current balance
   const { credits } = useAI();
   console.log('Current credits:', credits);

   // Add credits (admin)
   await fetch('/api/ai/credits/add', {
     method: 'POST',
     body: JSON.stringify({ amount: 100 })
   });
   ```

2. **Deep mode consuming too many credits**
   ```typescript
   // Switch to fast mode for non-critical tasks
   const result = await processPrompt(prompt, data, 'fast');
   ```

---

### "Failed to process request" Error

**Symptom**: Generic processing error from AI endpoint.

**Possible Causes**:

1. **Invalid API Key**
   ```bash
   # Verify in server/.env
   GEMINI_API_KEY=your_valid_key_here

   # Restart the server after updating
   cd server && pnpm dev
   ```

2. **Model Rate Limiting**
   - Wait 60 seconds and retry
   - The system has automatic retry logic with exponential backoff
   - If persistent, check Google AI Console for quota status

3. **Invalid Input Data**
   ```typescript
   // Ensure data is valid JSON
   const data = JSON.parse(JSON.stringify(yourData));

   // Check for circular references
   try {
     JSON.stringify(data);
   } catch (e) {
     console.error('Data has circular references');
   }
   ```

---

### Charts Not Rendering

**Symptom**: Chart generation returns config but nothing displays.

**Solutions**:

1. **Verify ECharts is installed**
   ```bash
   pnpm list echarts echarts-for-react
   # Should show both packages
   ```

2. **Check chart config structure**
   ```typescript
   const result = await generateChart(prompt, data);
   console.log('Chart config:', JSON.stringify(result.chartConfig, null, 2));

   // Verify it has required properties
   // { xAxis, yAxis, series } or { series } for pie charts
   ```

3. **Container sizing issue**
   ```tsx
   // Ensure container has dimensions
   <div style={{ width: '100%', height: '400px' }}>
     <ReactECharts option={chartConfig} />
   </div>
   ```

---

### Slow Response Times

**Symptom**: AI requests take longer than expected.

**Optimizations**:

1. **Use Fast Mode for simple tasks**
   ```typescript
   // Force fast mode
   const result = await processPrompt(prompt, data, 'fast');
   ```

2. **Reduce data payload**
   ```typescript
   // Send only necessary fields
   const lightData = data.map(({ id, name, value }) => ({ id, name, value }));
   ```

3. **Enable context caching**
   ```typescript
   // Set context once, reuse for related queries
   setProjectData(data);
   // Subsequent calls use cached context
   ```

4. **Check network latency**
   ```bash
   # Test API response time
   time curl -X POST http://localhost:3001/api/ai/process \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test", "data": []}'
   ```

---

### Auto-Routing Selecting Wrong Tier

**Symptom**: Simple prompts going to Thinker, or complex ones to Cleaner.

**Solutions**:

1. **Preview tier before sending**
   ```typescript
   const preview = await previewTier(prompt);
   console.log('Detected tier:', preview.tier);
   console.log('Complexity score:', preview.complexity);
   ```

2. **Override with explicit mode**
   ```typescript
   // Force specific tier
   const result = await processPrompt(prompt, data, 'deep');  // Always Thinker
   const result = await processPrompt(prompt, data, 'fast');  // Always Worker
   ```

3. **Improve prompt clarity**
   ```typescript
   // Add complexity signals for deep analysis
   "Analyze the correlation between marketing spend and customer acquisition,
    considering seasonal factors and competitive landscape"

   // Keep simple for fast processing
   "Format this data as a table"
   ```

---

### GTD Tasks Not Extracting Properly

**Symptom**: Task extraction returns empty or incorrect tasks.

**Solutions**:

1. **Use clear action language**
   ```typescript
   // BAD - Passive voice
   "The report should be reviewed"

   // GOOD - Active voice with clear actions
   "Review the quarterly report by Friday"
   "Call John to discuss budget"
   "Send proposal to client"
   ```

2. **Include date context**
   ```typescript
   // Explicit dates help extraction
   "Complete by January 15th"
   "Due next Monday"
   "ASAP priority"
   ```

---

### Database Connection Errors

**Symptom**: Errors related to Prisma or database operations.

**Solutions**:

1. **Verify database URL**
   ```bash
   # In server/.env
   DATABASE_URL="postgresql://user:pass@localhost:5432/nabd"
   # or for SQLite
   DATABASE_URL="file:./dev.db"
   ```

2. **Run migrations**
   ```bash
   cd server
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

3. **Reset database (development only)**
   ```bash
   cd server
   npx prisma migrate reset
   ```

4. **Check Prisma client**
   ```bash
   cd server
   npx prisma generate
   ```

---

### Authentication Errors

**Symptom**: 401 Unauthorized or token-related errors.

**Solutions**:

1. **Verify Clerk setup**
   ```typescript
   // Check token is being sent
   const { getToken } = useAuth();
   const token = await getToken();
   console.log('Token exists:', !!token);
   ```

2. **Check mock auth mode**
   ```bash
   # In .env for development without Clerk
   VITE_USE_MOCK_AUTH=true
   ```

3. **Verify Authorization header**
   ```typescript
   // Ensure header is set correctly
   fetch('/api/ai/process', {
     headers: {
       'Authorization': `Bearer ${token}`,
       'Content-Type': 'application/json'
     }
   });
   ```

---

### Memory Issues

**Symptom**: Server crashes or OOM errors with large datasets.

**Solutions**:

1. **Limit data size**
   ```typescript
   // Paginate large datasets
   const chunk = data.slice(0, 1000);
   const result = await processPrompt(prompt, chunk);
   ```

2. **Use streaming for file uploads**
   ```typescript
   // For large files, process in chunks
   const formData = new FormData();
   formData.append('file', file);
   // Backend handles streaming
   ```

3. **Increase Node.js memory (if needed)**
   ```bash
   # In package.json scripts
   "dev": "NODE_OPTIONS='--max-old-space-size=4096' node ..."
   ```

---

## Error Code Reference

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `INSUFFICIENT_CREDITS` | User out of credits | Add credits or use fast mode |
| `INVALID_API_KEY` | Gemini API key invalid | Check server/.env |
| `RATE_LIMITED` | Too many requests | Wait and retry |
| `INVALID_INPUT` | Malformed request data | Validate JSON structure |
| `MODEL_UNAVAILABLE` | AI model offline | System will use fallback |
| `PROCESSING_FAILED` | General AI error | Check logs, retry |
| `UNAUTHORIZED` | Invalid auth token | Re-authenticate |

---

## Getting Help

### Check Logs

```bash
# Server logs
cd server && pnpm dev
# Watch for error messages

# Frontend console
# Open browser DevTools > Console
```

### Debug Mode

```typescript
// Enable verbose logging
localStorage.setItem('NABD_DEBUG', 'true');
// Refresh page - will show detailed AI logs
```

### Report Issues

If you continue experiencing issues:

1. Collect error messages and logs
2. Note the steps to reproduce
3. Include your environment (OS, Node version, browser)
4. Check existing issues or create new one

---

*For API details, see [API Reference](./API-Reference.md). For optimization tips, see [Best Practices](./Best-Practices.md).*
