package runners.performance;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

public class LoginPerfRunner {

        @Test
        void testLoginPerformance() throws IOException {
                System.out.println("🚀 Starting Performance Test - 100 requests with 10 threads...");

                long startTime = System.currentTimeMillis();

                // 10 threads cho 10 users, mỗi user thực hiện 10 API calls = 100 total requests
                Results results = Runner.path("classpath:features/performance/login-performance.feature")
                                .configDir("classpath:karate-config.js")
                                .parallel(10); // 10 threads

                long endTime = System.currentTimeMillis();
                long totalTime = endTime - startTime;

                // Extract request-level stats (similar to SequentialLoginRunner)
                int successfulRequests = 100; // Default: assume all 100 passed if scenario passed
                int failedRequests = 0;
                double requestSuccessRate = 100.0;

                // If any scenario failed, calculate failed requests
                if (results.getScenariosFailed() > 0) {
                        // Each failed scenario = 10 failed requests (since each scenario has 10 calls)
                        failedRequests = results.getScenariosFailed() * 10;
                        successfulRequests = 100 - failedRequests;
                        requestSuccessRate = (double) successfulRequests / 100 * 100;
                }

                // Generate report
                generatePerformanceReport(results, totalTime, successfulRequests, failedRequests, requestSuccessRate);
        }

        private void generatePerformanceReport(Results results, long totalTime, int successfulRequests,
                        int failedRequests, double requestSuccessRate)
                        throws IOException {
                File reportDir = new File("target/performance-reports");
                if (!reportDir.exists()) {
                        reportDir.mkdirs();
                }

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
                String timestamp = dateFormat.format(new Date());

                StringBuilder reportBuilder = new StringBuilder();
                reportBuilder.append("# Performance Test Results - ").append(timestamp).append("\n\n");
                reportBuilder.append("## Test Configuration\n");
                reportBuilder.append("- Test Type: **PARALLEL (10 threads)**\n");
                reportBuilder.append("- Concurrent Users: 10\n");
                reportBuilder.append("- Iterations per User: 10\n");
                reportBuilder.append("- Total Requests: 100\n");
                reportBuilder.append("- Concurrency Level: 10 threads\n\n");

                reportBuilder.append("## Results\n");
                reportBuilder.append("- Total Execution Time: ").append(totalTime).append(" ms\n");
                reportBuilder.append("- Average Time Per Request: ")
                                .append(String.format("%.2f", totalTime / 100.0)).append(" ms\n");
                reportBuilder.append("- Requests Per Second: ")
                                .append(String.format("%.2f", 100000.0 / totalTime)).append("\n");
                reportBuilder.append("- Test Status: ").append(results.getFeaturesPassed() > 0 ? "PASSED" : "FAILED")
                                .append("\n");
                reportBuilder.append("- Total Requests: 100\n");
                reportBuilder.append("- Successful Requests: ").append(successfulRequests).append("\n");
                reportBuilder.append("- Failed Requests: ").append(failedRequests).append("\n");
                reportBuilder.append("- Success Rate: ").append(String.format("%.2f", requestSuccessRate))
                                .append("%\n\n");

                reportBuilder.append("## Performance Characteristics\n");
                reportBuilder.append("- **Parallel Execution**: 10 users running simultaneously\n");
                reportBuilder.append("- **Medium Concurrency**: Moderate load testing\n");
                reportBuilder.append("- **Real-world Simulation**: Multiple users at same time\n");

                FileWriter writer = new FileWriter(new File(reportDir, "performance-report-" + timestamp + ".md"));
                writer.write(reportBuilder.toString());
                writer.close();

                System.out.println("\n=====================================================");
                System.out.println("🚀 PARALLEL Performance Test Results:");
                System.out.println("- Total Time: " + totalTime + " ms");
                System.out.println("- Average Time Per Request: " + String.format("%.2f", totalTime / 100.0) + " ms");
                System.out.println("- Requests Per Second: " + String.format("%.2f", 100000.0 / totalTime));
                System.out.println("- Performance Report saved to: "
                                + new File(reportDir, "performance-report-" + timestamp + ".md").getAbsolutePath());
                System.out.println("=====================================================\n");
        }
}