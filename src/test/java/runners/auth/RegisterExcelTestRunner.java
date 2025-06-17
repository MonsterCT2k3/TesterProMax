package runners.auth;

import com.intuit.karate.junit5.Karate;

class RegisterExcelTestRunner {

    @Karate.Test
    Karate testRegisterComprehensive() {
        return Karate.run("classpath:features/auth/register-excel.feature")
                .relativeTo(getClass());
    }
}