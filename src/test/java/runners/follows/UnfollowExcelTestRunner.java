package runners.follows;

import com.intuit.karate.junit5.Karate;

class UnfollowExcelTestRunner {

    @Karate.Test
    Karate testUnfollowExcel() {
        return Karate.run("classpath:features/follows/unfollow-excel.feature");
    }
}