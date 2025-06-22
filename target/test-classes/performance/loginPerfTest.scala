package performance

import com.intuit.karate.gatling.PreDef._
import io.gatling.core.Predef._
import scala.concurrent.duration._

class LoginPerfTest extends Simulation {

  val loginProtocol = karateProtocol(
    "/auth/login" -> Nil
  )

  val loginFeature = scenario("Login Performance Test")
    .repeat(5) {  // Lặp lại 5 lần mỗi scenario
      exec(karateFeature("classpath:features/performance/login-performance.feature"))
    }

  setUp(
    loginFeature.inject(atOnceUsers(10))  // 10 users đồng thời, mỗi user lặp 5 lần = 50 total
  ).protocols(loginProtocol)
}