# DormManager - Documentation Index

## 📚 Quick Navigation

### 🚀 Getting Started (5 minutes)
Start here if you're new to the project:
- **[JMETER_QUICKSTART.md](JMETER_QUICKSTART.md)** - Run performance tests in 5 minutes
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project overview

### 📖 Detailed Guides
Comprehensive documentation for each component:

#### Testing & Quality Assurance
- **[JMETER_README.md](JMETER_README.md)** - Complete performance testing guide
  - How to set up JMeter
  - Understanding test plans
  - Interpreting results
  - Troubleshooting

- **[COVERAGE_REPORT.md](COVERAGE_REPORT.md)** - Code coverage analysis
  - Coverage metrics
  - Service layer breakdown
  - Test statistics
  - Improvement recommendations

- **[JACOCO_SETUP.md](JACOCO_SETUP.md)** - Code coverage tool reference
  - JaCoCo configuration
  - Running coverage reports
  - CI/CD integration

#### Project Overview
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete project status
  - Development phases
  - Deliverables
  - Directory structure
  - All quick commands

### 🔧 Configuration Files
- **pom.xml** - Maven build configuration
  - Spring Boot dependencies
  - JUnit 5 and Mockito
  - JaCoCo coverage plugin

---

## 📊 Current Project Status

### ✅ What's Complete

#### Backend Services
- ✅ Spring Boot 3.3.3 REST API
- ✅ MySQL Database (Hibernate ORM)
- ✅ JWT Authentication
- ✅ 12 REST Controllers
- ✅ 5 Service Classes
- ✅ Real-time Notification System
- ✅ Role-based Access Control

#### Testing Infrastructure
- ✅ 33 Unit Tests (100% passing)
- ✅ JaCoCo Code Coverage (44% overall, 78% services)
- ✅ JMeter Performance Tests (50 concurrent users)
- ✅ Automated Test Scripts

#### Documentation
- ✅ Complete API documentation
- ✅ Testing guides
- ✅ Setup instructions
- ✅ Troubleshooting guides

---

## 🚀 Quick Start Commands

### 1. Start the Application
```bash
mvn spring-boot:run
# Runs on http://localhost:8081
```

### 2. Run Unit Tests
```bash
mvn test
# 33 tests, 100% pass rate
```

### 3. Generate Code Coverage Report
```bash
mvn clean test jacoco:report
# Open: target/site/jacoco/index.html
```

### 4. Run Performance Tests
```bash
scripts\start-test.bat
# Automated: Starts API, runs JMeter, generates report
# Results: results/report/index.html
```

---

## 📁 Directory Guide

```
DormManager/
├── src/main/java/          - Backend source code
├── src/test/java/          - Unit tests (33 tests)
├── scripts/                - Test automation scripts
├── jmeter/                 - JMeter test plans
├── results/                - Test results (generated)
├── target/                 - Build artifacts
│   └── site/jacoco/        - Code coverage reports
├── pom.xml                 - Maven configuration
└── *.md                    - Documentation files
```

---

## 📖 Documentation Files

### For Performance Testing
| File | Purpose | Read Time |
|------|---------|-----------|
| JMETER_QUICKSTART.md | Fast start guide | 5 min |
| JMETER_README.md | Complete reference | 15 min |
| scripts/start-test.bat | Main test runner | N/A |

### For Code Quality
| File | Purpose | Read Time |
|------|---------|-----------|
| COVERAGE_REPORT.md | Coverage analysis | 10 min |
| JACOCO_SETUP.md | Tool configuration | 10 min |
| target/site/jacoco/index.html | Interactive report | 5 min |

### For Project Overview
| File | Purpose | Read Time |
|------|---------|-----------|
| PROJECT_SUMMARY.md | Complete overview | 20 min |
| README.md | Getting started | 10 min |

---

## 🎯 Common Tasks

### Task: Run Performance Tests
1. Open terminal in project root
2. Run: `scripts\start-test.bat`
3. Wait for tests to complete
4. View report: `results/report/index.html`

**Resources:**
- [JMETER_QUICKSTART.md](JMETER_QUICKSTART.md)
- [JMETER_README.md](JMETER_README.md)

---

### Task: Check Code Coverage
1. Run: `mvn clean test jacoco:report`
2. Open: `target/site/jacoco/index.html`
3. Review coverage by package

**Resources:**
- [COVERAGE_REPORT.md](COVERAGE_REPORT.md)
- [JACOCO_SETUP.md](JACOCO_SETUP.md)

---

### Task: Run Unit Tests
1. Run: `mvn test -Dtest=*ServiceTest`
2. Check output for failures (none expected)
3. All 33 tests should pass

**Resources:**
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Test statistics

---

### Task: Start Application
1. Run: `mvn spring-boot:run`
2. Wait for: "Tomcat started on port(s): 8081"
3. Access: `http://localhost:8081`

---

## 📊 Key Metrics at a Glance

### Test Results
- **Unit Tests**: 33 total, 100% passing ✅
- **Code Coverage**: 44% overall, 78% services
- **Performance**: 50 concurrent users, 500 requests

### Component Breakdown
- **Services**: 78% coverage (excellent)
- **Entities**: 54% coverage (good)
- **Controllers**: 10% coverage (in progress)
- **DTO**: 34% coverage (baseline)

### API Endpoints Tested
1. POST `/api/auth/login`
2. GET `/api/etudiants/me/demandes/count-en-cours`
3. GET `/api/etudiants/me/affectation`
4. GET `/api/notifications/me/stats`
5. GET `/api/reclamations/me/count`

---

## 🔗 External Resources

### JMeter
- Official Website: https://jmeter.apache.org/
- Documentation: https://jmeter.apache.org/usermanual/
- Best Practices: https://jmeter.apache.org/usermanual/best-practices.html

### JaCoCo
- Official Website: https://www.jacoco.org/
- Maven Plugin: https://www.jacoco.org/jacoco/trunk/doc/maven.html

### Spring Boot
- Official Guide: https://spring.io/projects/spring-boot
- REST API: https://spring.io/guides/gs/rest-service/

### Testing
- JUnit 5: https://junit.org/junit5/docs/current/user-guide/
- Mockito: https://javadoc.io/doc/org.mockito/mockito-core/

---

## ❓ Troubleshooting

### Issue: Tests Won't Run
- See [JMETER_QUICKSTART.md](JMETER_QUICKSTART.md) - Troubleshooting section

### Issue: Coverage Report Not Generated
- See [JACOCO_SETUP.md](JACOCO_SETUP.md) - Troubleshooting section

### Issue: Performance Tests Failing
- See [JMETER_README.md](JMETER_README.md) - Troubleshooting section

### Issue: Unit Tests Failing
- Run: `mvn clean test -U`
- Check database connection in `application.properties`

---

## 📝 File Descriptions

### Documentation Files (5 total)
1. **README.md** - Original project README
2. **PROJECT_SUMMARY.md** - Complete project overview ⭐ START HERE
3. **COVERAGE_REPORT.md** - Code coverage analysis
4. **JACOCO_SETUP.md** - Coverage tool guide
5. **JMETER_README.md** - Comprehensive testing guide
6. **JMETER_QUICKSTART.md** - 5-minute quick start ⭐ QUICK START

### Script Files (4 total)
1. **scripts/start-api.bat** - Start Spring Boot API
2. **scripts/stop-api.bat** - Stop running API
3. **scripts/start-test.bat** - Main test runner ⭐ ENTRY POINT
4. **scripts/generate-report.bat** - Generate HTML report

### JMeter Files (2 total)
1. **jmeter/dormmanager-test.jmx** - Test plan XML
2. **jmeter/login-data.csv** - Student credentials

### Configuration Files
1. **pom.xml** - Maven configuration
2. **application.properties** - Spring Boot config

---

## 🎓 Learning Path

**New to the project?** Follow this order:

1. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** (20 min)
   - Understand what the project does
   - See all components
   - Review current status

2. **[JMETER_QUICKSTART.md](JMETER_QUICKSTART.md)** (5 min)
   - Learn how to run tests
   - Try running performance tests

3. **[COVERAGE_REPORT.md](COVERAGE_REPORT.md)** (10 min)
   - Understand code coverage
   - See test statistics

4. **[JMETER_README.md](JMETER_README.md)** (15 min)
   - Deep dive into performance testing
   - Learn to interpret results

5. **[JACOCO_SETUP.md](JACOCO_SETUP.md)** (10 min)
   - Understand coverage tracking
   - Set up CI/CD integration

---

## ✨ What's New (December 8, 2025)

### Phase 3: Performance Testing Added
- ✅ JMeter test plan created
- ✅ Automated test scripts
- ✅ Load testing infrastructure
- ✅ Performance testing documentation

### Phase 2 (Previous): Code Coverage
- ✅ JaCoCo integration
- ✅ Coverage reports
- ✅ Coverage documentation

### Phase 1 (Previous): Unit Testing
- ✅ 33 unit tests
- ✅ Service layer tests
- ✅ 100% pass rate

---

## 📞 Support

**For questions about:**
- **Performance Testing** → [JMETER_README.md](JMETER_README.md)
- **Code Coverage** → [COVERAGE_REPORT.md](COVERAGE_REPORT.md)
- **Quick Start** → [JMETER_QUICKSTART.md](JMETER_QUICKSTART.md)
- **Project Overview** → [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)
- **Setup Issues** → [JACOCO_SETUP.md](JACOCO_SETUP.md)

---

**Last Updated**: December 8, 2025  
**Project Version**: 0.0.1-SNAPSHOT  
**Status**:  Complete and Ready for Testing
