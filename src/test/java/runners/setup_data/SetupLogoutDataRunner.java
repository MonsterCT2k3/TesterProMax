package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupLogoutDataRunner {

    @Karate.Test
    Karate setupLogoutData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@logout");
    }
}