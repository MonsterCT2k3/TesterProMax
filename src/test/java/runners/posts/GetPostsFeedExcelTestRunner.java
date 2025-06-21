package runners.posts;

import com.intuit.karate.junit5.Karate;

class GetPostsFeedExcelTestRunner {

    @Karate.Test
    Karate testGetPostsFeed() {
        return Karate.run("classpath:features/posts/get-posts-feed-excel.feature");
    }

}