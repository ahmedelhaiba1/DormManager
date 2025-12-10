# JaCoCo Test Coverage - Quick Start Guide

## What Was Added

### 1. Maven Plugin Configuration
Added to `pom.xml` in the `<build>` section:
- **jacoco-maven-plugin v0.8.10**
- Three executions for automatic code coverage tracking

### 2. How It Works

When you run tests with Maven, JaCoCo will:
1. **Prepare Agent**: Instrument the Java bytecode before test execution
2. **Collect Data**: Track which code lines are executed during tests
3. **Generate Report**: Create HTML, CSV, and XML coverage reports
4. **Check Coverage**: Validate that coverage meets minimum thresholds (50%)

## Running Tests with Coverage

### Generate Full Coverage Report
```bash
mvn clean test jacoco:report
```

### Generate Coverage for Service Tests Only (Fast)
```bash
mvn test -Dtest="AdminServiceTest,EtudiantServiceTest,GestionnaireServiceTest" jacoco:report
```

### Generate Coverage for Specific Test
```bash
mvn test -Dtest=AdminServiceTest jacoco:report
```

## Viewing Coverage Reports

After running tests, open the report:
```
target/site/jacoco/index.html
```

### Report Contents
- **index.html**: Main coverage summary and package breakdown
- **jacoco.csv**: Machine-readable coverage data
- **jacoco.xml**: XML format for CI/CD integration
- **jacoco-sessions.html**: Test execution session details

## Coverage Interpretation

### Traffic Light Colors
- 🟢 **Green**: Well-covered code (good)
- 🟡 **Yellow**: Partially covered (medium)
- 🔴 **Red**: Not covered (gaps)

### Key Metrics

| Metric | Description |
|--------|-------------|
| **Instructions** | Actual bytecode instructions executed |
| **Branches** | Decision points (if/else) covered |
| **Lines** | Source code lines with any coverage |
| **Methods** | Methods with any coverage |
| **Cyclomatic Complexity** | Code path combinations |

## Current Project Coverage

```
Service Layer:    78% ✅ (Excellent - 959/1224 instructions)
Entity Models:    54%     (Good - 292/533 instructions)  
Data Transfer:    34%     (Basic - 183/526 instructions)
Controllers:      10%     (Limited - 120/1097 instructions)
Overall:          44%     (1964/3533 instructions)
```

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Run Tests with Coverage
  run: mvn clean test jacoco:report

- name: Upload Coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./target/site/jacoco/jacoco.xml
```

### Quality Gates
The build will fail if package coverage drops below **50%** (configurable in pom.xml)

## Tips for Improving Coverage

1. **Identify Gaps**: Look at red areas in the HTML report
2. **Write Tests**: Add unit tests for uncovered code paths
3. **Check Branches**: Ensure all if/else conditions are tested
4. **Run Reports**: Track coverage trends over time
5. **Set Thresholds**: Gradually increase minimum coverage requirements

## Troubleshooting

### Report Not Generated
```bash
# Clear old reports and rebuild
mvn clean test jacoco:report
```

### Build Fails with Coverage Error
The pom.xml is configured to fail if coverage drops below 50%. To temporarily disable:
```bash
mvn test -Djacoco.skip=true
```

To permanently adjust threshold, edit pom.xml:
```xml
<minimum>0.50</minimum>  <!-- Change this value -->
```

## Files Modified

- ✅ `pom.xml` - Added jacoco-maven-plugin configuration
- ✅ `COVERAGE_REPORT.md` - Detailed coverage documentation

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `mvn clean test jacoco:report` | Generate full coverage report |
| `mvn test` | Run tests with JaCoCo tracking |
| `mvn jacoco:report` | Generate report from existing data |
| `mvn jacoco:check` | Validate coverage thresholds |
| `mvn clean` | Clear old reports |

## Next Steps

1. Run tests regularly to track coverage trends
2. View HTML report to identify coverage gaps
3. Add tests for low-coverage areas
4. Integrate coverage reports into CI/CD pipeline
5. Set increasingly higher coverage targets over time

---

**Last Updated**: December 7, 2025  
**JaCoCo Version**: 0.8.10  
**Configuration**: pom.xml (build/plugins section)
