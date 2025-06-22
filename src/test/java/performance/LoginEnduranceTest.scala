package performance

import com.intuit.karate.gatling.PreDef._
import io.gatling.core.Predef._
import scala.concurrent.duration._

class LoginEnduranceTest extends Simulation {

  val loginProtocol = karateProtocol(
    "/api/login" -> Nil
  )

  val loginFeature = scenario("Login Endurance Test")
    .exec(karateFeature("classpath:features/performance/login-performance.feature"))

  // Kịch bản kiểm thử độ ổn định: duy trì tải trung bình trong thời gian dài
  setUp(
    loginFeature.inject(
      constantUsersPerSec(5) during (5 minutes)
    )
  ).protocols(loginProtocol)
}