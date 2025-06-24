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

public class ConcurrentLoginRunner {

        @Test
        void testConcurrentLoginPerformance() throws IOException {
                System.out.println("🚀 Starting Concurrent Performance Test - 100 requests with 100 threads...");

                long startTime = System.currentTimeMillis();

                // 100 threads đồng thời, mỗi thread 1 API call
                Results results = Runner.path("classpath:features/performance/login-performance-concurrent.feature")
                                .configDir("classpath:karate-config.js")
                                .parallel(100); // 100 concurrent threads

                long endTime = System.currentTimeMillis();
                long totalTime = endTime - startTime;

                // Extract request-level stats (similar to SequentialLoginRunner)
                int successfulRequests = 100; // Default: assume all 100 passed if scenario passed
                int failedRequests = 0;
                double requestSuccessRate = 100.0;

                // If any scenario failed, calculate actual failed requests
                if (results.getScenariosFailed() > 0) {
                        failedRequests = results.getScenariosFailed();
                        successfulRequests = results.getScenariosPassed();
                        requestSuccessRate = (double) successfulRequests / 100 * 100;
                }

                // Generate report
                generateConcurrentReport(results, totalTime, successfulRequests, failedRequests, requestSuccessRate);
        }

        private void generateConcurrentReport(Results results, long totalTime, int successfulRequests,
                        int failedRequests, double requestSuccessRate)
                        throws IOException {
                File reportDir = new File("target/performance-reports");
                if (!reportDir.exists()) {
                        reportDir.mkdirs();
                }

                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
                String timestamp = dateFormat.format(new Date());

                StringBuilder reportBuilder = new StringBuilder();
                reportBuilder.append("# Concurrent Performance Test Results - ").append(timestamp).append("\n\n");
                reportBuilder.append("## Test Configuration\n");
                reportBuilder.append("- Test Type: **CONCURRENT (100 threads)**\n");
                reportBuilder.append("- Total Requests: 100\n");
                reportBuilder.append("- Concurrency Level: 100 threads (maximum)\n");
                reportBuilder.append("- Execution Pattern: All requests simultaneously\n\n");

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
                reportBuilder.append("- **Maximum Concurrency**: 100 simultaneous requests\n");
                reportBuilder.append("- **High Load Testing**: Stress testing server limits\n");
                reportBuilder.append("- **Peak Performance**: Maximum throughput measurement\n");

                FileWriter writer = new FileWriter(new File(reportDir, "concurrent-report-" + timestamp + ".md"));
                writer.write(reportBuilder.toString());
                writer.close();

                System.out.println("\n=====================================================");
                System.out.println("🚀 CONCURRENT Performance Test Results:");
                System.out.println("- Total Time: " + totalTime + " ms");
                System.out.println("- Average Time Per Request: " + String.format("%.2f", totalTime / 100.0) + " ms");
                System.out.println("- Requests Per Second: " + String.format("%.2f", 100000.0 / totalTime));
                System.out.println("- Concurrent Report saved to: "
                                + new File(reportDir, "concurrent-report-" + timestamp + ".md").getAbsolutePath());
                System.out.println("=====================================================\n");
        }
}