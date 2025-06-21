package runners.auth;

import com.intuit.karate.junit5.Karate;

class ChangePasswordExcelTestRunner {

    @Karate.Test
    Karate testChangePasswordExcel() {
        return Karate.run("classpath:features/auth/change-password-excel.feature");
    }
}