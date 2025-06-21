package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupChangePasswordDataRunner {

    @Karate.Test
    Karate setupChangePasswordData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@change-password");
    }
}