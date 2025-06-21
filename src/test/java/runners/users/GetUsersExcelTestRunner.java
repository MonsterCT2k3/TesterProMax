package runners.users;

import com.intuit.karate.junit5.Karate;

class GetUsersExcelTestRunner {

    @Karate.Test
    Karate testGetUsers() {
        return Karate.run("classpath:features/users/get-users-excel.feature");
    }

}