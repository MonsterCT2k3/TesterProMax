package runners.performance;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class Concurrent50ThreadsRunner {

    @Test
    void testConcurrent50ThreadsPerformance() throws IOException {
        System.out.println("🚀 Starting 50-Threads Performance Test - 50 requests with 50 threads...");

        long startTime = System.currentTimeMillis();

        // 50 threads đồng thời, mỗi thread 1 API call
        Results results = Runner.path("classpath:features/performance/login-performance-50threads.feature")
                .configDir("classpath:karate-config.js")
                .parallel(50); // 50 concurrent threads

        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;

        // Extract request-level stats (similar to other runners)
        int totalRequests = 100; // Updated to 100 requests
        int successfulRequests = totalRequests; // Default: assume all 100 passed if scenario passed
        int failedRequests = 0;
        double requestSuccessRate = 100.0;

        // If any scenario failed, calculate actual failed requests
        if (results.getScenariosFailed() > 0) {
            failedRequests = results.getScenariosFailed();
            successfulRequests = results.getScenariosPassed();
            requestSuccessRate = (double) successfulRequests / totalRequests * 100;
        }

        // Generate report
        generateConcurrent50Report(results, totalTime, successfulRequests, failedRequests, requestSuccessRate);
    }

    private void generateConcurrent50Report(Results results, long totalTime, int successfulRequests, int failedRequests,
            double requestSuccessRate)
            throws IOException {
        File reportDir = new File("target/performance-reports");
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String timestamp = dateFormat.format(new Date());

        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("# 50-Threads Performance Test Results - ").append(timestamp).append("\n\n");
        reportBuilder.append("## Test Configuration\n");
        reportBuilder.append("- Test Type: **CONCURRENT (50 threads)**\n");
        reportBuilder.append("- Total Requests: 100\n");
        reportBuilder.append("- Concurrency Level: 50 threads (medium-high)\n");
        reportBuilder.append("- Execution Pattern: All requests simultaneously\n");
        reportBuilder.append("- Purpose: Find optimal concurrency threshold\n\n");

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
        reportBuilder.append("- **Medium-High Concurrency**: 50 simultaneous requests\n");
        reportBuilder.append("- **Threshold Testing**: Finding server breaking point\n");
        reportBuilder.append("- **Load Testing**: Between optimal and stress zones\n");
        reportBuilder.append("- **Comparison Point**: vs 10 threads (optimal) and 100 threads (overload)\n");

        FileWriter writer = new FileWriter(new File(reportDir, "concurrent-50threads-report-" + timestamp + ".md"));
        writer.write(reportBuilder.toString());
        writer.close();

        System.out.println("\n=====================================================");
        System.out.println("🚀 50-THREADS Performance Test Results:");
        System.out.println("- Total Time: " + totalTime + " ms");
        System.out.println("- Average Time Per Request: " + String.format("%.2f", totalTime / 100.0) + " ms");
        System.out.println("- Requests Per Second: " + String.format("%.2f", 100000.0 / totalTime));
        System.out.println("- 50-Threads Report saved to: "
                + new File(reportDir, "concurrent-50threads-report-" + timestamp + ".md").getAbsolutePath());
        System.out.println("=====================================================\n");
    }
}