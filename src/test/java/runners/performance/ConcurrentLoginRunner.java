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
        // 100 API calls hoàn toàn đồng thời
        int totalRequests = 100;

        long startTime = System.currentTimeMillis();

        // 100 threads đồng thời, mỗi thread 1 API call
        Results results = Runner.path("classpath:features/performance/login-performance-concurrent.feature")
                .configDir("classpath:karate-config.js")
                .parallel(100); // 100 concurrent threads

        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;

        // Generate report
        generateConcurrentReport(results, totalRequests, totalTime);
    }

    private void generateConcurrentReport(Results results, int totalRequests, long totalTime)
            throws IOException {
        File reportDir = new File("target/performance-reports");
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String timestamp = dateFormat.format(new Date());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", totalRequests);
        stats.put("successfulRequests", results.getScenariosPassed());
        stats.put("failedRequests", results.getScenariosFailed());
        stats.put("totalTimeMs", totalTime);
        stats.put("averageTimePerRequestMs", totalTime / (double) totalRequests);

        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("# Concurrent Performance Test Results - ").append(timestamp).append("\n\n");
        reportBuilder.append("## Test Configuration\n");
        reportBuilder.append("- Test Type: **100 CONCURRENT API CALLS**\n");
        reportBuilder.append("- Total Requests: ").append(totalRequests).append("\n");
        reportBuilder.append("- Concurrency Level: 100 threads\n\n");

        reportBuilder.append("## Results\n");
        reportBuilder.append("- Total Time: ").append(totalTime).append(" ms\n");
        reportBuilder.append("- Average Time Per Request: ")
                .append(String.format("%.2f", stats.get("averageTimePerRequestMs"))).append(" ms\n");
        reportBuilder.append("- Successful Requests: ").append(stats.get("successfulRequests")).append("\n");
        reportBuilder.append("- Failed Requests: ").append(stats.get("failedRequests")).append("\n\n");

        reportBuilder.append("## Performance Analysis\n");
        reportBuilder.append("- Requests Per Second: ")
                .append(String.format("%.2f", 1000 * totalRequests / (double) totalTime))
                .append("\n");

        FileWriter writer = new FileWriter(new File(reportDir, "concurrent-report-" + timestamp + ".md"));
        writer.write(reportBuilder.toString());
        writer.close();

        System.out.println("\n=====================================================");
        System.out.println("CONCURRENT Performance Test Results:");
        System.out.println("- Total Time: " + totalTime + " ms");
        System.out.println(
                "- Average Time Per Request: "
                        + String.format("%.2f", stats.get("averageTimePerRequestMs")) + " ms");
        System.out.println(
                "- Requests Per Second: " + String.format("%.2f",
                        1000 * totalRequests / (double) totalTime));
        System.out.println("- Concurrent Report saved to: "
                + new File(reportDir, "concurrent-report-" + timestamp + ".md").getAbsolutePath());
        System.out.println("=====================================================\n");
    }
}