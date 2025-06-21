package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupGetFollowersDataRunner {

    @Karate.Test
    Karate setupGetFollowersData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@get-followers");
    }
}