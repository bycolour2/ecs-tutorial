# Session Logs

This directory contains session logs that document the work performed during development and debugging.

## Available Logs

### Recent Sessions
- [Session 2025-01-18: Replay Determinism Fix](./session-2025-01-18-replay-determinism-fix.md) - Detailed log of fixing the replay non-determinism issue

## Log Conventions

- Use format: `session-YYYY-MM-DD-description.md`
- Include timestamp and description in filename
- Document the full process of problem-solving
- Include investigation steps, root cause, and solutions
- Reference any files that were modified
- Include test results before and after fixes

## What to Include in Session Logs

1. **Problem Description**
   - What issue was being addressed
   - Initial observations and symptoms

2. **Investigation Process**
   - Steps taken to understand the problem
   - Debug scripts or tools created
   - Key discoveries and findings

3. **Solution Implementation**
   - Changes made to the codebase
   - Files modified and why
   - Code examples of key changes

4. **Verification**
   - Tests run to verify the fix
   - Results before and after
   - Any edge cases considered

5. **Lessons Learned**
   - Insights gained from the problem
   - Future improvements or preventive measures

## Example Log Structure

```markdown
# Session Log: YYYY-MM-DD - Brief Description

## Problem Identification
- [List of initial problems or issues]

## Investigation Process
### Step 1: Initial Analysis
- [What was investigated]
### Step 2: Root Cause Discovery
- [Key findings]

## Solution Implementation
[Details of the fix]

## Verification
[Test results]

## Files Modified
[List of changed files]

## Lessons Learned
[Key takeaways]
```

## Related

- Documentation can be found in the `../docs/` directory
- Source code is in the `../src/` directory
