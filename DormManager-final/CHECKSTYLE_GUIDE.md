# Checkstyle - Static Code Analysis Guide

## Overview

Checkstyle is a development tool to help programmers write Java code that adheres to a coding standard. It automates the process of checking Java code to spare humans of this boring (and error-prone) task.

**Current Configuration**: Google/Sun Java Style with Spring Boot enhancements

## Installation & Setup

### 1. Already Configured in pom.xml ✅

The Maven Checkstyle plugin (v3.3.1) has been added to your project:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-checkstyle-plugin</artifactId>
    <version>3.3.1</version>
    ...
</plugin>
```

### 2. Configuration File: checkstyle.xml

Located in project root: `checkstyle.xml`

Covers:
- **Naming Conventions**: Classes, methods, variables follow Java standards
- **Javadoc Comments**: Documentation requirements for public APIs
- **Import Organization**: No star imports, organized by package
- **Line Length**: Maximum 120 characters per line
- **Code Complexity**: Cyclomatic complexity, parameter counts, method length
- **Whitespace & Formatting**: Proper indentation and spacing
- **Code Quality**: No System.out.println in production code

## Running Checkstyle

### Option 1: Run During Maven Build (Automatic)

Checkstyle runs automatically during the `validate` phase:

```bash
mvn validate
```

Or run with the entire build:

```bash
mvn clean compile
```

**Output**: Violations displayed in console during build

### Option 2: Run Checkstyle Goal Directly

Check code without running full build:

```bash
mvn checkstyle:check
```

Generate detailed HTML report:

```bash
mvn checkstyle:checkstyle
```

Report location: `target/checkstyle-result.xml` and HTML in `target/site/`

### Option 3: Check Specific Package

Check only your main source code:

```bash
mvn checkstyle:check -DsourceDirectories=src/main/java
```

## Configuration Details

### Naming Conventions

| Element | Rule | Example |
|---------|------|---------|
| **Classes** | PascalCase | `UserController`, `EtudiantService` |
| **Methods** | camelCase | `getUserById()`, `saveEtudiant()` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_SIZE`, `DEFAULT_TIMEOUT` |
| **Variables** | camelCase | `userName`, `isActive` |
| **Packages** | lowercase.separated | `com.dormmanager.controller` |
| **Parameters** | camelCase | `userId`, `requestData` |

### Code Complexity Limits

| Metric | Limit | Description |
|--------|-------|-------------|
| **Cyclomatic Complexity** | 10 | Max nested if/switch statements |
| **Method Length** | 100 lines | Maximum lines per method |
| **Parameter Count** | 7 | Maximum parameters in method signature |
| **Boolean Expression** | 3 | Max boolean operators in expression |
| **Class Fan-Out** | 20 | Max different classes referenced |
| **Line Length** | 120 chars | Maximum characters per line |

### Javadoc Requirements

**Must Document** (public scope):
- ✅ Public classes and interfaces
- ✅ Public methods
- ✅ Public fields

**Format**:
```java
/**
 * Brief description of what this method does.
 * Can span multiple lines.
 *
 * @param userId the ID of the user
 * @return the user object, or null if not found
 * @throws IllegalArgumentException if userId is negative
 */
public User getUserById(long userId) {
    // implementation
}
```

### Import Organization

**Correct** ✅:
```java
import java.util.List;
import java.util.Map;

import javax.annotation.Nullable;

import com.dormmanager.entity.User;
import com.dormmanager.repository.UserRepository;
```

**Incorrect** ❌:
```java
import java.util.*;
import static java.util.Collections.*;
import com.dormmanager.*;
```

## Common Violations & Fixes

### 1. Line Too Long (> 120 characters)

**Violation**:
```java
private String generateComplexValidationErrorMessage(User user, List<ValidationError> errors, String context) {
```

**Fix**: Break into multiple lines
```java
private String generateComplexValidationErrorMessage(
        User user,
        List<ValidationError> errors,
        String context) {
```

### 2. Method Too Long (> 100 lines)

**Violation**: Method with 150 lines

**Fix**: Extract into smaller methods
```java
private void processRequest(Request req) {
    validateRequest(req);
    transformData(req);
    sendResponse(req);
}
```

### 3. Too Many Parameters (> 7)

**Violation**:
```java
public void createUser(String name, String email, String phone, 
                       String address, String city, String zip, 
                       String country, String role) { }
```

**Fix**: Use a DTO or builder
```java
public void createUser(UserCreateRequest request) { }

// Or use Builder pattern
public void createUser(User user) { }
```

### 4. Missing Javadoc

**Violation**:
```java
public String getUserName() {
    return name;
}
```

**Fix**:
```java
/**
 * Gets the user's name.
 * @return the user's full name
 */
public String getUserName() {
    return name;
}
```

### 5. System.out.println in Production Code

**Violation**:
```java
public void process() {
    System.out.println("Processing user: " + userId);
    // ...
}
```

**Fix**: Use logging framework
```java
private static final Logger logger = LoggerFactory.getLogger(UserService.class);

public void process() {
    logger.info("Processing user: {}", userId);
    // ...
}
```

### 6. Cyclomatic Complexity Too High (> 10)

**Violation**:
```java
public void validateUser(User user) {
    if (user != null) {
        if (user.getName() != null) {
            if (user.getName().length() > 0) {
                if (user.getEmail() != null) {
                    if (user.getEmail().contains("@")) {
                        // ... more conditions
                    }
                }
            }
        }
    }
}
```

**Fix**: Use guard clauses
```java
public void validateUser(User user) {
    if (user == null) throw new IllegalArgumentException("User cannot be null");
    if (user.getName() == null || user.getName().isEmpty()) 
        throw new IllegalArgumentException("Name is required");
    if (user.getEmail() == null || !user.getEmail().contains("@")) 
        throw new IllegalArgumentException("Email is invalid");
    // ... rest of validation
}
```

### 7. Unused Imports

**Violation**:
```java
import java.util.*;
import java.io.*;
import org.unused.library.*;
```

**Fix**: Remove unused imports
```java
import java.util.List;
import java.util.Map;
```

## Integration with IDE

### IntelliJ IDEA

1. **Install Plugin**: Settings → Plugins → Search "Checkstyle-IDEA" → Install
2. **Configure**: Settings → Checkstyle → Import configuration from checkstyle.xml
3. **Run**: Right-click project → Run Checkstyle
4. **View Results**: View → Tool Windows → Checkstyle

### VS Code

1. **Install Extension**: Search "Checkstyle for Java"
2. **Configure**: Set path to checkstyle.xml in settings
3. **Real-time Analysis**: Errors shown as you type

## Best Practices

### 1. Run Checkstyle Before Committing

```bash
mvn checkstyle:check
```

Fix any violations before pushing code.

### 2. Make it Part of CI/CD Pipeline

```bash
mvn clean validate compile
```

Fails build if Checkstyle violations exist (when `failsOnError=true`).

### 3. Address Warnings Incrementally

Don't try to fix all violations at once. Fix by category:

```bash
# Focus on naming violations first
# Then code complexity
# Then documentation
```

### 4. Document Exceptions

If a violation is intentional, document it:

```java
@SuppressWarnings("checkstyle:MethodLength")
public void complexBusinessLogic() {
    // Legitimate reason for long method explained here
}
```

### 5. Keep Configuration Updated

Review checkstyle.xml periodically:
- Add new rules as team grows
- Adjust thresholds if they're too strict/lenient
- Document any custom rules

## Reports & Analysis

### Generate HTML Report

```bash
mvn checkstyle:checkstyle
```

Open: `target/site/checkstyle.html`

Includes:
- Total violations by type
- Violations per file
- Severity breakdown
- Details of each violation

### Parse XML Report

```bash
mvn checkstyle:check -X
```

XML output: `target/checkstyle-result.xml`

Use for CI/CD integration or custom analysis.

## Troubleshooting

### Problem: "Cannot find checkstyle.xml"

**Solution**: Ensure checkstyle.xml is in project root (same level as pom.xml)

```bash
ls -la checkstyle.xml    # On Mac/Linux
dir checkstyle.xml      # On Windows
```

### Problem: Checkstyle passes locally but fails in CI

**Solution**: Ensure CI environment has same Java version and Maven version

```bash
mvn -v
java -version
```

### Problem: Too many violations - can't fix all at once

**Solution**: 
1. Run with `failsOnError=false` (current setting)
2. Fix violations incrementally
3. Change to `failsOnError=true` when ready

### Problem: Plugin not running

**Solution**: Explicitly run the plugin

```bash
mvn org.apache.maven.plugins:maven-checkstyle-plugin:3.3.1:check
```

## Next Steps

1. **Run Checkstyle**: `mvn checkstyle:check`
2. **Review Report**: `mvn checkstyle:checkstyle` → check `target/site/checkstyle.html`
3. **Fix Violations**: Address issues by priority
4. **Integrate IDE**: Install IDE plugin for real-time feedback
5. **CI/CD**: Add checkstyle to build pipeline

## Resources

- **Official Docs**: https://checkstyle.sourceforge.io/
- **Rules Reference**: https://checkstyle.sourceforge.io/checks.html
- **Maven Plugin**: https://maven.apache.org/plugins/maven-checkstyle-plugin/
- **Google Java Style Guide**: https://google.github.io/styleguide/javaguide.html

---

**Last Updated**: December 8, 2025
**Checkstyle Version**: 10.12.7
**Maven Plugin**: 3.3.1
