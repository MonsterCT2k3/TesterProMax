package runners.unlike;

import com.intuit.karate.junit5.Karate;

class UnlikeExcelTestRunner {

    @Karate.Test
    Karate testUnlike() {
        return Karate.run("classpath:features/unlike/unlike-excel.feature");
    }

}