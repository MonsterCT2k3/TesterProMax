package performance

import com.intuit.karate.gatling.PreDef._
import io.gatling.core.Predef._
import scala.concurrent.duration._

class LoginStressTest extends Simulation {

  val loginProtocol = karateProtocol(
    "/api/login" -> Nil
  )

  val loginFeature = scenario("Login Stress Test")
    .exec(karateFeature("classpath:features/performance/login-performance.feature"))

  // Kịch bản stress test: tăng đột biến đến 100 người dùng trong 30 giây
  setUp(
    loginFeature.inject(
      nothingFor(5 seconds),
      rampUsers(100) during (30 seconds)
    )
  ).protocols(loginProtocol)
}