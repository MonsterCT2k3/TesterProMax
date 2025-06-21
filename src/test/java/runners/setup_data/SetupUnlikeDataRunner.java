package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupUnlikeDataRunner {

    @Karate.Test
    Karate setupUnlikeData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@unlike");
    }

}