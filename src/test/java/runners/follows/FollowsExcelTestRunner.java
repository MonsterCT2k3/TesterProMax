package runners.follows;

import com.intuit.karate.junit5.Karate;

class FollowsExcelTestRunner {
    @Karate.Test
    Karate testFollows() {
        return Karate.run("classpath:features/follows/follows-excel.feature")
                .relativeTo(getClass());
    }
}