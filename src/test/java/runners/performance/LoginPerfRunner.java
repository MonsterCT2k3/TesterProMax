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
        // Các thông số kiểm thử hiệu năng
        int users = 10;        // Số lượng người dùng đồng thời
        int iterations = 5;    // Số lần lặp lại mỗi kịch bản

        long startTime = System.currentTimeMillis();
        
        Results results = Runner.path("classpath:features/performance/login-performance.feature")
                .configDir("classpath:karate-config.js")
                .parallel(users * iterations);
        
        long endTime = System.currentTimeMillis();
        long totalTime = endTime - startTime;
        
        // Generate report
        generatePerformanceReport(results, users, iterations, totalTime);
    }
    
    private void generatePerformanceReport(Results results, int users, int iterations, long totalTime) throws IOException {
        File reportDir = new File("target/performance-reports");
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }
        
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss");
        String timestamp = dateFormat.format(new Date());
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRequests", users * iterations);
        // Sửa lỗi: thay thế getPassed() và getFailed() bằng phương thức mới
        stats.put("successfulRequests", results.getScenariosPassed());
        stats.put("failedRequests", results.getScenariosFailed());
        stats.put("totalTimeMs", totalTime);
        stats.put("averageTimePerRequestMs", totalTime / (double)(users * iterations));
        
        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("# Performance Test Results - ").append(timestamp).append("\n\n");
        reportBuilder.append("## Test Configuration\n");
        reportBuilder.append("- Concurrent Users: ").append(users).append("\n");
        reportBuilder.append("- Iterations: ").append(iterations).append("\n");
        reportBuilder.append("- Total Requests: ").append(users * iterations).append("\n\n");
        
        reportBuilder.append("## Results\n");
        reportBuilder.append("- Total Time: ").append(totalTime).append(" ms\n");
        reportBuilder.append("- Average Time Per Request: ").append(String.format("%.2f", stats.get("averageTimePerRequestMs"))).append(" ms\n");
        reportBuilder.append("- Successful Requests: ").append(stats.get("successfulRequests")).append("\n");
        reportBuilder.append("- Failed Requests: ").append(stats.get("failedRequests")).append("\n\n");
        
        reportBuilder.append("## Performance Analysis\n");
        reportBuilder.append("- Requests Per Second: ").append(String.format("%.2f", 1000 * (users * iterations) / (double)totalTime)).append("\n");
        
        FileWriter writer = new FileWriter(new File(reportDir, "performance-report-" + timestamp + ".md"));
        writer.write(reportBuilder.toString());
        writer.close();
        
        System.out.println("\n=====================================================");
        System.out.println("Performance Test Results:");
        System.out.println("- Total Time: " + totalTime + " ms");
        System.out.println("- Average Time Per Request: " + String.format("%.2f", stats.get("averageTimePerRequestMs")) + " ms");
        System.out.println("- Requests Per Second: " + String.format("%.2f", 1000 * (users * iterations) / (double)totalTime));
        System.out.println("- Report saved to: " + new File(reportDir, "performance-report-" + timestamp + ".md").getAbsolutePath());
        System.out.println("=====================================================\n");
    }
}