#!/bin/bash

# Run all test suites and collect summary
cd /home/tung/kcpm/test/selenium_tests

echo "========================================="
echo "CHẠY TOÀN BỘ TEST SUITES - LingoLab"
echo "========================================="
echo ""

test_suites=(
  "signup:src/tests/signup.test.ts"
  "signin:src/tests/signin.test.ts"
  "profile:src/tests/profile.test.ts"
  "speaking:src/tests/speaking.test.ts"
  "writing:src/tests/writing.test.ts"
  "history:src/tests/history.test.ts"
  "statistics:src/tests/statistics.test.ts"
  "result:src/tests/result.test.ts"
  "teacher:src/tests/teacher.test.ts"
)

total_passed=0
total_failed=0
total_tests=0

for suite in "${test_suites[@]}"; do
  name="${suite%%:*}"
  file="${suite##*:}"
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Testing: $name"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  # Run test and capture output
  output=$(npx jest --runInBand "$file" 2>&1)
  
  # Extract summary
  passed=$(echo "$output" | grep -o "[0-9]* passed" | grep -o "[0-9]*" | head -1)
  failed=$(echo "$output" | grep -o "[0-9]* failed" | grep -o "[0-9]*" | head -1)
  
  if [ -z "$passed" ]; then passed=0; fi
  if [ -z "$failed" ]; then failed=0; fi
  
  tests=$((passed + failed))
  
  echo "✅ Passed: $passed"
  echo "❌ Failed: $failed"
  echo "📊 Total: $tests"
  echo ""
  
  total_passed=$((total_passed + passed))
  total_failed=$((total_failed + failed))
  total_tests=$((total_tests + tests))
done

echo "========================================="
echo "TỔNG KẾT"
echo "========================================="
echo "✅ Tổng passed: $total_passed"
echo "❌ Tổng failed: $total_failed"
echo "📊 Tổng tests: $total_tests"
if [ $total_tests -gt 0 ]; then
  pass_rate=$(awk "BEGIN {printf \"%.1f\", ($total_passed/$total_tests)*100}")
  echo "📈 Tỉ lệ pass: $pass_rate%"
fi
echo "========================================="
