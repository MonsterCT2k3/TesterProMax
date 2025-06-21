package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupDataRunner {

    @Karate.Test
    Karate setupData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@setup");
    }
}