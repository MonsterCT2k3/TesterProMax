package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupUnfollowDataRunner {

    @Karate.Test
    Karate setupUnfollowData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@unfollow");
    }
}