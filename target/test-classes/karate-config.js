function fn() {
    var env = karate.env; // Lấy từ system property 'karate.env'
    karate.log('karate.env system property was:', env);
    if (!env) {
        env = 'dev';
    }
    var config = {
        env: env,
        baseUrl: 'http://localhost:3000',
        timeout: 30000,
        // Bearer token for changePassword tests - update this token as needed
        bearerToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjI4NDUzMi04ZjFlLTRiMDUtYWM1NC1kODAzNzM4NmU4MGMiLCJ1c2VybmFtZSI6InVzZXJubzIiLCJyb2xlIjowLCJpYXQiOjE3NTA2OTQzNTQsImV4cCI6MTc1MDY5Nzk1NH0.cn4pcMTzJbKyd0aw-bN_KvZNRCfEwxef9wljw6vUgkw'
    };

    // Cấu hình headers mặc định
    karate.configure('headers', {
        'Content-Type': 'application/json',
    });

    // Cấu hình timeout
    karate.configure('connectTimeout', 5000);
    karate.configure('readTimeout', 5000);

    // Log config
    karate.configure('logPrettyRequest', true);
    karate.configure('logPrettyResponse', true);


    return config;
} 