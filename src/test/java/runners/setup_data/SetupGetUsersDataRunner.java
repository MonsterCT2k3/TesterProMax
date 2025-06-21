package runners.setup_data;

import com.intuit.karate.junit5.Karate;

class SetupGetUsersDataRunner {

    @Karate.Test
    Karate setupGetUsersData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .tags("@getUsers");
    }

}