package performance

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import scala.concurrent.duration._

class LoginPerfGatling extends Simulation {

  // Cấu hình HTTP protocol
  val httpProtocol = http
    .baseUrl("http://localhost:3000")
    .acceptHeader("application/json")
    .contentTypeHeader("application/json")

  // Scenario definition
  val loginScenario = scenario("Login Performance Test")
    .exec(http("Login Request")
      .post("/auth/login")
      .body(StringBody("""{"email": "nam@gmail.com", "password": "123456"}"""))
      .check(status.is(200)))

  // Setup simulation
  setUp(
    loginScenario.inject(
      // Ramp up: tăng dần từ 0 lên 10 users trong 10 giây
      rampUsers(10) during(10.seconds),
      // Constant: giữ 5 requests/second trong 30 giây
      constantUsersPerSec(5) during(30.seconds)
    )
  ).protocols(httpProtocol)
   .maxDuration(60.seconds)
   .assertions(
     global.responseTime.max.lt(5000),      // Response time tối đa < 5s
     global.responseTime.mean.lt(1000),     // Response time trung bình < 1s
     global.successfulRequests.percent.gt(95) // Tỷ lệ thành công > 95%
   )
} 