# JMeter Quick Start - 5 Minute Guide

## Installation (One-time Setup)

### 1. Install JMeter
- Download: https://jmeter.apache.org/download_jmeter.cgi
- Extract to: `C:\jmeter`
- Add to PATH:
  - Open Environment Variables
  - Add to PATH: `C:\jmeter\bin`
- Verify: `jmeter --version`

### 2. Verify Prerequisites
```bash
java -version          # Java 8+
mvn --version          # Maven
jmeter --version       # JMeter installed
```

## Running Performance Tests

### ⚡ Quick Run (Automated)
```bash
scripts\start-test.bat
```

**What it does:**
1. Stops any existing API on port 8081
2. Starts the Spring Boot API
3. Waits 20 seconds for API startup
4. Runs JMeter with 50 concurrent users
5. Generates HTML report in `results/report/`
6. Stops the API

**Time to complete**: ~5-10 minutes (depending on system)

---

## Manual Run (If You Prefer)

### Terminal 1 - Start API
```bash
scripts\start-api.bat
```
⏳ Wait for: `Tomcat started on port(s): 8081`

### Terminal 2 - Run Tests
```bash
jmeter -n -t jmeter\dormmanager-test.jmx -l results\output.csv -e -o results\report
```
or for me 
```bash
C:\JMeter\apache-jmeter-5.6.2\bin\jmeter.bat -n -t jmeter\dormmanager-test.jmx -l results\output.csv -e -o results\report
```


### Terminal 1 - Stop API (when done)
```bash
scripts\stop-api.bat
```

---

## Viewing Results

### Open HTML Report
After tests complete:
```
results/report/index.html
```

**Key Metrics to Check:**
- Average Response Time: Should be < 500ms
- Error %: Should be < 1%
- Throughput: Should be > 100 req/s
- 99th Percentile: Should be < 2000ms

---

## Test Configuration

### What's Being Tested?

**Load Profile:**
- 50 concurrent users
- 10-second ramp-up
- 2 loops each
- Total: 500 requests

**API Endpoints:**
1. POST `/api/auth/login` - Authenticate
2. GET `/api/etudiants/me/demandes/count-en-cours` - Dashboard stats
3. GET `/api/etudiants/me/affectation` - Room assignment
4. GET `/api/notifications/me/stats` - Notifications
5. GET `/api/reclamations/me/count` - Complaints count

### Student Credentials
Located in: `jmeter/login-data.csv`

```
email,password
fatima@gmail.com,123456
hamdan@uiz.ac.ma,123456
boufatla@gmail.com,123456
ysn@gmail.com,123456
test@student.com,123456
jps@gmail.com,123456
blz.etudiant@gmail.com,123456
```

---

## Troubleshooting

### Problem: "JMeter is not installed"
```bash
# Add to PATH or run from JMeter bin folder
C:\jmeter\bin\jmeter -n -t jmeter\dormmanager-test.jmx
```

### Problem: "Connection refused on port 8081"
- API didn't start: Wait 20+ seconds and check `localhost:8081` in browser
- Port already in use: `netstat -ano | findstr :8081`

### Problem: "Login failed"
- Credentials wrong in `jmeter/login-data.csv`
- Student doesn't exist in database
- Wrong password

### Problem: "High error rate in results"
- Check API logs for exceptions
- Database connection issues?
- Timeout settings too low

---

## Customizing Tests

### Change Number of Users
Edit: `jmeter\dormmanager-test.jmx`
Find: `<stringProp name="ThreadGroup.num_threads">50</stringProp>`
Change `50` to your desired number

### Change Ramp-up Time
Find: `<stringProp name="ThreadGroup.ramp_time">10</stringProp>`
Change `10` to desired seconds (e.g., `30` for 30 seconds)

### Change Loop Count
Find: `<stringProp name="LoopController.loops">2</stringProp>`
Change `2` to desired iterations

---

## Understanding Results

### Response Time Chart
- X-axis: Time during test
- Y-axis: Response time (ms)
- **Green line**: Average
- **Red peaks**: Slow responses
- **Goal**: Flat line under 500ms

### Throughput Chart
- Shows requests per second
- **Higher is better**
- Should be consistent throughout test

### Error Rate
- Shows failed requests %
- **Lower is better**
- Target: < 1%

### Percentiles
- **50th (Median)**: Half responses faster, half slower
- **90th**: 90% of responses complete by this time
- **99th**: 99% of responses complete by this time
- Target 99th: < 2000ms

---

## Common Performance Issues

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| High response times | Slow queries | Optimize SQL, add indexes |
| Errors during load | Low connection pool | Increase DB pool size |
| Low throughput | Blocking operations | Use async processing |
| Timeouts | API too slow | Increase timeout in JMeter |
| Memory spike | Memory leak | Check service memory usage |

---

## Files Reference

| File | Purpose |
|------|---------|
| `scripts/start-test.bat` | **Main entry point** - Runs entire test suite |
| `scripts/start-api.bat` | Start Spring Boot API on port 8081 |
| `scripts/stop-api.bat` | Stop API running on port 8081 |
| `scripts/generate-report.bat` | Generate report from existing results |
| `jmeter/dormmanager-test.jmx` | JMeter test plan (XML) |
| `jmeter/login-data.csv` | Student login credentials |
| `results/output.csv` | Raw test results |
| `results/report/index.html` | Generated HTML report |

---

## Tips & Tricks

✅ **Before running tests:**
- Ensure database is available
- Verify students exist in database
- Close unnecessary applications to free resources

✅ **During tests:**
- Don't close the API terminal window
- Monitor API logs for errors
- Don't run other heavy processes

✅ **After tests:**
- Always stop the API: `scripts\stop-api.bat`
- Archive results if needed
- Compare results across test runs

---

## Next Steps

1. **Install JMeter** if not already done
2. **Verify credentials** in `jmeter/login-data.csv`
3. **Run tests**: `scripts\start-test.bat`
4. **Review report**: Open `results/report/index.html`
5. **Optimize** based on findings

---

**Questions?** See `JMETER_README.md` for detailed documentation

**Last Updated**: December 8, 2025
