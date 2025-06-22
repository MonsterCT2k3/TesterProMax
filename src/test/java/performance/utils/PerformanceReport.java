package performance.utils;

import com.intuit.karate.Results;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class PerformanceReport {

    public static void generateReport(Results results) {
        try {
            List<Map<String, Object>> scenarioTimes = new ArrayList<>();
            
            results.getScenarioResults().forEach(sr -> {
                Map<String, Object> info = new HashMap<>();
                info.put("scenario", sr.getScenario().getName());
                info.put("responseTime", sr.getDurationMillis());
                info.put("status", sr.isFailed() ? "FAILED" : "PASSED");
                scenarioTimes.add(info);
            });

            DoubleSummaryStatistics stats = scenarioTimes.stream()
                .mapToDouble(m -> ((Number) m.get("responseTime")).doubleValue())
                .summaryStatistics();

            StringBuilder sb = new StringBuilder();
            sb.append("# Báo cáo kiểm thử hiệu năng\n\n");
            sb.append("## Tổng quan\n");
            sb.append("* **Tổng số kịch bản:** ").append(scenarioTimes.size()).append("\n");
            // Sửa lỗi: thay thế getPassed() và getFailed() bằng phương thức mới
            sb.append("* **Thành công:** ").append(results.getScenariosPassed()).append("\n");
            sb.append("* **Thất bại:** ").append(results.getScenariosFailed()).append("\n");
            sb.append("* **Thời gian trung bình:** ").append(String.format("%.2f", stats.getAverage())).append(" ms\n");
            sb.append("* **Thời gian nhanh nhất:** ").append(String.format("%.2f", stats.getMin())).append(" ms\n");
            sb.append("* **Thời gian chậm nhất:** ").append(String.format("%.2f", stats.getMax())).append(" ms\n\n");

            sb.append("## Chi tiết từng kịch bản\n\n");
            sb.append("| Kịch bản | Thời gian phản hồi (ms) | Trạng thái |\n");
            sb.append("|----------|-------------------------|------------|\n");
            
            scenarioTimes.forEach(info -> {
                sb.append("| ").append(info.get("scenario"))
                  .append(" | ").append(String.format("%.2f", ((Number) info.get("responseTime")).doubleValue()))
                  .append(" | ").append(info.get("status"))
                  .append(" |\n");
            });

            File reportDir = new File("target/performance-reports");
            if (!reportDir.exists()) {
                reportDir.mkdirs();
            }
            
            FileWriter fw = new FileWriter(new File(reportDir, "performance-summary.md"));
            fw.write(sb.toString());
            fw.close();
            
            System.out.println("Báo cáo hiệu năng đã được tạo tại: " + reportDir.getAbsolutePath() + "/performance-summary.md");
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}