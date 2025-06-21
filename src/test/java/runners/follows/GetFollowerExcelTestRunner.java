package runners.follows;

import com.intuit.karate.junit5.Karate;

class GetFollowerExcelTestRunner {

    @Karate.Test
    Karate testGetFollowerExcel() {
        return Karate.run("classpath:features/follows/get-followers-excel.feature");
    }
}