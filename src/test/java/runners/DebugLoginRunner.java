package runners;

import com.intuit.karate.junit5.Karate;

public class DebugLoginRunner {

    @Karate.Test
    Karate testDebugLogin() {
        return Karate.run("classpath:features/performance/debug-login.feature");
    }
}