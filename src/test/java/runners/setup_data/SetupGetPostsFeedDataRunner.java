package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupGetPostsFeedDataRunner {

    @Karate.Test
    Karate setupGetPostsFeedData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@getPostsFeed");
    }

}