package runners.follows;

import com.intuit.karate.junit5.Karate;

class GetFollowingExcelTestRunner {

    @Karate.Test
    Karate testGetFollowingExcel() {
        return Karate.run("classpath:features/follows/get-following-excel.feature");
    }
}