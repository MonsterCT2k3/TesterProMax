package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupFollowsDataRunner {

    @Karate.Test
    Karate setupFollowsData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@follows");
    }
}