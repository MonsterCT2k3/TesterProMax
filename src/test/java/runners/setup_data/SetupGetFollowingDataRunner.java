package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupGetFollowingDataRunner {

    @Karate.Test
    Karate setupGetFollowingData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@get-following");
    }
}