package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupLikeDataRunner {

    @Karate.Test
    Karate setupLikeData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@like");
    }

}