#!/bin/bash

# Quick summary of test results from individual suite runs
# Usage: ./quick-suite-summary.sh

echo "================================================"
echo "Quick Test Suite Summary"
echo "================================================"
echo ""

# Test suites
suites=("signup" "signin" "profile" "speaking" "writing" "teacher" "history" "statistics")

total_passed_tests=0
total_failed_tests=0
total_skipped_tests=0

echo "Suite Results:"
echo "--------------"

for suite in "${suites[@]}"; do
    echo ""
    echo "Testing: $suite"
    
    # Run with timeout (max 5 minutes per suite)
    timeout 300 npm run test:$suite 2>&1 | tee "${suite}_quick.log" | tail -20
    
    # Extract summary
    if [ -f "${suite}_quick.log" ]; then
        echo ""
        echo "Summary for $suite:"
        grep -E "(Test Suites:|Tests:)" "${suite}_quick.log" | tail -2
    fi
    
    echo "---"
done

echo ""
echo "================================================"
echo "All logs saved as: <suite>_quick.log"
echo "================================================"
