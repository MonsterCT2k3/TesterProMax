package runners.like;

import com.intuit.karate.junit5.Karate;

class LikeExcelTestRunner {

    @Karate.Test
    Karate testLike() {
        return Karate.run("classpath:features/like/like-excel.feature");
    }

}