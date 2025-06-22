package performance

import com.intuit.karate.gatling.PreDef._
import io.gatling.core.Predef._
import scala.concurrent.duration._

class LoginPerfTest extends Simulation {

  val loginProtocol = karateProtocol(
    "/auth/login" -> Nil
  )

  val loginFeature = scenario("Login Performance Test")
    .exec(karateFeature("classpath:features/performance/login-performance.feature"))

  setUp(
    loginFeature.inject(rampUsers(10) during (60 seconds))
  ).protocols(loginProtocol)
}