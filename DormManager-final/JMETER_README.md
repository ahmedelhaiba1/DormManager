# DormManager JMeter Performance Testing Guide

## Overview

This directory contains the JMeter performance testing suite for the DormManager application. The test plan simulates real student usage patterns with 50 concurrent users performing typical dashboard operations.

## Directory Structure

```
├── scripts/
│   ├── start-api.bat           # Starts the Spring Boot API
│   ├── stop-api.bat            # Stops the API running on port 8081
│   ├── start-test.bat          # Main script - runs everything
│   └── generate-report.bat     # Generates report from existing results
│
├── jmeter/
│   ├── dormmanager-test.jmx    # JMeter test plan
│   └── login-data.csv          # Student credentials for load testing
│
└── results/
    ├── output.csv              # Raw test results (CSV format)
    ├── jmeter.log              # Test execution log
    └── report/                 # HTML report directory
        ├── index.html          # Main report page
        └── [other report files]
```

## Prerequisites

### 1. JMeter Installation

#### Windows
1. Download from: https://jmeter.apache.org/download_jmeter.cgi
2. Extract to a folder (e.g., `C:\jmeter`)
3. Add to PATH environment variable:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - Edit PATH and add: `C:\jmeter\bin`
4. Verify installation:
   ```bash
   jmeter --version
   ```

### 2. Java Installation
- JMeter requires Java 8 or higher
- Verify: `java -version`

### 3. Maven (if not already installed)
- The `start-api.bat` script uses Maven to start the application
- Ensure Maven is in your PATH

## Student Login Credentials

The `jmeter/login-data.csv` file contains real student accounts for load testing:

```
email,password
fatima@gmail.com,123456
fatima@gmail.com,123456
fatima@gmail.com,123456
fatima@gmail.com,123456
fatima@gmail.com,123456
fatima@gmail.com,123456
fatima@gmail.com,123456
```

**Note**: Update these credentials if you have different test accounts in your database.

## Running the Tests

### Quick Start (Automated)

Simply run the main script:
```bash
scripts\start-test.bat
```

This script will:
1. ✅ Verify JMeter is installed
2. 🛑 Stop any existing API instances
3. 🚀 Start the DormManager API (waits 20 seconds for startup)
4. ▶️ Execute the JMeter test plan with 50 concurrent users
5. 📊 Generate HTML report in `results/report/`
6. 🛑 Stop the API after tests complete
7. 📂 Optionally open the HTML report

### Manual Steps

If you prefer to run components separately:

**Terminal 1 - Start API:**
```bash
scripts\start-api.bat
```
Wait for: "Tomcat started on port(s): 8081"

**Terminal 2 - Run Tests:**
```bash
jmeter -n -t jmeter\dormmanager-test.jmx -l results\output.csv -e -o results\report
```

**Terminal 1 - Stop API:**
```bash
scripts\stop-api.bat
```

### Regenerate Report

If you want to generate a new HTML report from existing results:
```bash
scripts\generate-report.bat
```

## Test Plan Details

### Configuration
- **Users**: 50 concurrent threads
- **Ramp-up**: 10 seconds (gradually increase to 50 users)
- **Loop Count**: 2 (each user runs the test sequence twice)
- **Total Requests**: 50 users × 2 loops × 5 API calls = 500 requests

### Test Sequence

Each user performs the following operations:

1. **Login** (POST /api/auth/login)
   - Authenticates with provided credentials
   - Extracts and stores JWT token for subsequent requests

2. **Get Dashboard Stats** (GET /api/etudiants/me/demandes/count-en-cours)
   - Retrieves pending housing request count
   - Uses authorization header with token

3. **Get Affectation** (GET /api/etudiants/me/affectation)
   - Retrieves current room assignment (affectation)
   - Simulates user checking their room assignment

4. **Get Notifications Stats** (GET /api/notifications/me/stats)
   - Retrieves notification statistics
   - Checks unread notifications

5. **Get Reclamations Count** (GET /api/reclamations/me/count)
   - Retrieves complaint/reclamation count
   - Simulates user checking complaints

## Performance Metrics

### Key Metrics in Report

| Metric | Description | Good Range |
|--------|-------------|-----------|
| **Response Time** | Average time for API to respond | < 500ms |
| **90th Percentile** | 90% of requests complete in this time | < 1000ms |
| **99th Percentile** | 99% of requests complete in this time | < 2000ms |
| **Throughput** | Requests processed per second | > 100 req/s |
| **Error Rate** | Percentage of failed requests | < 1% |
| **Min/Max Response** | Minimum and maximum response times | Acceptable if max < 5000ms |

### Interpreting Results

**✅ Good Performance:**
- Response times: 100-300ms
- Error rate: 0-0.5%
- Throughput: 150+ requests/sec
- 99th percentile < 1000ms

**⚠️ Acceptable Performance:**
- Response times: 300-500ms
- Error rate: 0.5-2%
- Throughput: 100-150 requests/sec
- 99th percentile < 2000ms

**❌ Performance Issues:**
- Response times: > 1000ms
- Error rate: > 5%
- Throughput: < 100 requests/sec
- Many timeouts (connection refused)

## Understanding the HTML Report

Open `results/report/index.html` after tests complete.

### Dashboard
- Overall statistics
- Response time graph
- Throughput over time

### Graphs
- **Response Times Over Time**: Shows if response degradation occurs
- **Bytes Throughput**: Network bandwidth usage
- **Active Threads Over Time**: Confirms ramp-up profile

### Details
- Per-request statistics
- Error logs (if any)
- Response time percentiles

## Troubleshooting

### "JMeter is not installed or not in PATH"
```bash
# Add JMeter to PATH
set PATH=%PATH%;C:\path\to\jmeter\bin
```

### API Won't Start
```bash
# Check if port 8081 is already in use
netstat -ano | findstr :8081
# If in use, stop the process or use a different port
```

### Connection Refused Errors
- Verify API started successfully (wait 20+ seconds)
- Check firewall isn't blocking localhost:8081
- Verify API logs in API terminal window

### Login Failures
- Verify login-data.csv has correct credentials
- Check that students exist in the database
- Verify /api/auth/login endpoint is accessible

### No Results Generated
- Check `results/jmeter.log` for error messages
- Ensure `results` directory exists and is writable
- Run JMeter in GUI mode for detailed debugging: `jmeter`

## Advanced Usage

### Modify Load Test Parameters

Edit `jmeter\dormmanager-test.jmx` to change:
- **Threads**: Change `<stringProp name="ThreadGroup.num_threads">50</stringProp>`
- **Ramp-up time**: Change `<stringProp name="ThreadGroup.ramp_time">10</stringProp>`
- **Loop count**: Change `<stringProp name="LoopController.loops">2</stringProp>`

### Add Custom Assertions

Add response assertions to fail tests based on:
- Response codes (e.g., must be 200)
- Response content (e.g., must contain "success")
- Response time (e.g., must complete in < 1 second)

### Monitor During Tests

In another terminal, monitor API performance:
```bash
# Watch CPU/Memory usage
tasklist /v | findstr java

# Monitor port 8081 traffic
netstat -ano | findstr :8081
```

## Performance Optimization Tips

Based on JMeter results:

1. **High Response Times**:
   - Check database query performance
   - Review service layer for inefficient operations
   - Consider adding caching

2. **Errors During Load**:
   - Check connection pool sizes
   - Review exception logs
   - Verify database can handle connections

3. **Low Throughput**:
   - Reduce database query complexity
   - Optimize blocking operations
   - Consider implementing async processing

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run JMeter Tests
  run: scripts\start-test.bat

- name: Upload Results
  uses: actions/upload-artifact@v2
  with:
    name: jmeter-results
    path: results/report/
```

### Jenkins Integration
```groovy
stage('Performance Tests') {
    steps {
        bat 'scripts\\start-test.bat'
        archiveArtifacts 'results/**/*'
    }
}
```

## Files Modified/Created

- ✅ `scripts/start-api.bat` - Starts the API
- ✅ `scripts/stop-api.bat` - Stops the API
- ✅ `scripts/start-test.bat` - Main test runner (ENTRY POINT)
- ✅ `scripts/generate-report.bat` - Report generator
- ✅ `jmeter/dormmanager-test.jmx` - Test plan
- ✅ `jmeter/login-data.csv` - Login credentials

## Support

For JMeter documentation: https://jmeter.apache.org/usermanual/
For performance testing best practices: https://jmeter.apache.org/usermanual/best-practices.html

---

**Created**: December 8, 2025  
**Test Plan**: DormManager Load Test  
**Target Load**: 50 concurrent users  
**Total Requests**: 500 (50 users × 2 loops × 5 API calls)  
**Endpoints Tested**: 5 (Login + 4 Dashboard operations)
