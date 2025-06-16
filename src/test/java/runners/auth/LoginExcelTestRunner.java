package runners.auth;

import com.intuit.karate.junit5.Karate;

class LoginExcelTestRunner {

    @Karate.Test
    Karate testLoginFromExcel() {
        return Karate.run("classpath:features/auth/login-excel.feature")
                .relativeTo(getClass());
    }
}