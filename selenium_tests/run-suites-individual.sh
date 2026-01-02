#!/bin/bash

# Script to run each test suite individually and collect results
# Usage: ./run-suites-individual.sh

echo "================================================"
echo "Running Selenium Test Suites Individually"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Results array
declare -A results
total_suites=0
passed_suites=0
failed_suites=0

# Test suites
suites=("signup" "signin" "profile" "speaking" "writing" "teacher" "history" "statistics")

# Run each suite
for suite in "${suites[@]}"; do
    total_suites=$((total_suites + 1))
    echo "================================================"
    echo "Running: $suite"
    echo "================================================"
    
    # Run test and capture exit code
    npm run test:$suite > "${suite}_results.log" 2>&1
    exit_code=$?
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}✓ $suite PASSED${NC}"
        results[$suite]="PASSED"
        passed_suites=$((passed_suites + 1))
    else
        echo -e "${RED}✗ $suite FAILED${NC}"
        results[$suite]="FAILED"
        failed_suites=$((failed_suites + 1))
        
        # Extract summary from log
        echo "  Summary:"
        grep -E "(Tests:|Test Suites:)" "${suite}_results.log" | tail -2 | sed 's/^/    /'
    fi
    echo ""
done

# Final summary
echo "================================================"
echo "FINAL SUMMARY"
echo "================================================"
echo ""
echo "Total Suites: $total_suites"
echo -e "${GREEN}Passed: $passed_suites${NC}"
echo -e "${RED}Failed: $failed_suites${NC}"
echo ""

echo "Detailed Results:"
echo "----------------"
for suite in "${suites[@]}"; do
    status=${results[$suite]}
    if [ "$status" == "PASSED" ]; then
        echo -e "  ${GREEN}✓${NC} $suite: $status"
    else
        echo -e "  ${RED}✗${NC} $suite: $status"
    fi
done

echo ""
echo "Individual logs saved as: <suite>_results.log"
echo ""

# Exit with failure if any suite failed
if [ $failed_suites -gt 0 ]; then
    exit 1
else
    exit 0
fi
