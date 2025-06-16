package runners.auth;

import com.intuit.karate.junit5.Karate;

class ExcelTestRunner {

    @Karate.Test
    Karate testAllExcelTests() {
        return Karate.run("classpath:features/auth")
                .relativeTo(getClass());
    }
}