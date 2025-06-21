package runners.auth;

import com.intuit.karate.junit5.Karate;

class LogoutExcelTestRunner {

    @Karate.Test
    Karate testLogoutExcel() {
        return Karate.run("classpath:features/auth/logout-excel.feature");
    }
}