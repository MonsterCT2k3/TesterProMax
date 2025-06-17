package runners.auth;

import com.intuit.karate.junit5.Karate;

class RegisterComprehensiveTestRunner {

    @Karate.Test
    Karate testRegisterComprehensive() {
        return Karate.run("classpath:features/auth/register-comprehensive.feature")
                .relativeTo(getClass());
    }
}