package runners.performance;

import com.intuit.karate.Results;
import com.intuit.karate.Runner;
import org.junit.jupiter.api.Test;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class ApiComparisonRunner {
    
    @Test
    void compareApiPerformance() throws IOException {
        // Danh sách các API cần so sánh
        Map<String, String> apisToTest = new HashMap<>();
        apisToTest.put("Login", "classpath:features/performance/login-performance.feature");
        // Thêm API khác nếu cần
        // apisToTest.put("Register", "classpath:features/performance/register-performance.feature");
        
        Map<String, List<Long>> apiResponseTimes = new HashMap<>();
        Map<String, List<Boolean>> apiSuccessResults = new HashMap<>();
        
        int iterations = 10; // Số lần lặp lại mỗi API để lấy thời gian trung bình
        
        // Chạy kiểm thử cho từng API và thu thập dữ liệu
        for (Map.Entry<String, String> api : apisToTest.entrySet()) {
            String apiName = api.getKey();
            String featurePath = api.getValue();
            
            List<Long> responseTimes = new ArrayList<>();
            List<Boolean> successResults = new ArrayList<>();
            
            for (int i = 0; i < iterations; i++) {
                long startTime = System.currentTimeMillis();
                Results results = Runner.path(featurePath).parallel(1);
                long endTime = System.currentTimeMillis();
                
                responseTimes.add(endTime - startTime);
                // Sửa lỗi: thay thế getFailed() bằng phương thức mới
                successResults.add(results.getScenariosFailed() == 0);
            }
            
            apiResponseTimes.put(apiName, responseTimes);
            apiSuccessResults.put(apiName, successResults);
        }
        
        // Tạo báo cáo so sánh
        generateComparisonReport(apiResponseTimes, apiSuccessResults, iterations);
    }
    
    private void generateComparisonReport(Map<String, List<Long>> apiResponseTimes, 
                                         Map<String, List<Boolean>> apiSuccessResults, 
                                         int iterations) throws IOException {
        
        StringBuilder sb = new StringBuilder();
        sb.append("# So sánh hiệu năng các API\n\n");
        
        sb.append("## Kết quả tổng quan\n\n");
        sb.append("| API | Thời gian trung bình (ms) | Tỷ lệ thành công | Thời gian nhanh nhất (ms) | Thời gian chậm nhất (ms) |\n");
        sb.append("|-----|---------------------------|------------------|---------------------------|---------------------------|\n");
        
        for (String apiName : apiResponseTimes.keySet()) {
            List<Long> times = apiResponseTimes.get(apiName);
            List<Boolean> successes = apiSuccessResults.get(apiName);
            
            double averageTime = times.stream().mapToLong(Long::longValue).average().orElse(0);
            long minTime = times.stream().mapToLong(Long::longValue).min().orElse(0);
            long maxTime = times.stream().mapToLong(Long::longValue).max().orElse(0);
            double successRate = (double) successes.stream().filter(Boolean::booleanValue).count() / iterations * 100;
            
            sb.append(String.format("| %s | %.2f | %.2f%% | %d | %d |\n", 
                      apiName, averageTime, successRate, minTime, maxTime));
        }
        
        sb.append("\n## Chi tiết từng lần chạy\n\n");
        
        for (String apiName : apiResponseTimes.keySet()) {
            List<Long> times = apiResponseTimes.get(apiName);
            List<Boolean> successes = apiSuccessResults.get(apiName);
            
            sb.append("### ").append(apiName).append("\n\n");
            sb.append("| Lần chạy | Thời gian (ms) | Kết quả |\n");
            sb.append("|----------|----------------|----------|\n");
            
            for (int i = 0; i < times.size(); i++) {
                sb.append(String.format("| %d | %d | %s |\n", 
                          i + 1, times.get(i), successes.get(i) ? "Thành công" : "Thất bại"));
            }
            
            sb.append("\n");
        }
        
        File reportDir = new File("target/performance-reports");
        if (!reportDir.exists()) {
            reportDir.mkdirs();
        }
        
        FileWriter fw = new FileWriter(new File(reportDir, "api-comparison-report.md"));
        fw.write(sb.toString());
        fw.close();
        
        System.out.println("Báo cáo so sánh API đã được tạo tại: " + reportDir.getAbsolutePath() + "/api-comparison-report.md");
    }
}