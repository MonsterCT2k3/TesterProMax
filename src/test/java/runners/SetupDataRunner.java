package runners;

import com.intuit.karate.junit5.Karate;

class SetupDataRunner {

    @Karate.Test
    Karate setupExcelData() {
        return Karate.run("classpath:features/setup-excel-data.feature")
                .relativeTo(getClass());
    }
}