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
        bearerToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MjZkMTIwYy1jMjM3LTQ1MTQtYWU5YS1lZDdhNjMwMzRjN2UiLCJ1c2VybmFtZSI6InVzZXJubzEiLCJyb2xlIjowLCJpYXQiOjE3NTA2NjA5OTQsImV4cCI6MTc1MDY2NDU5NH0.xaeWWmzAkIxGN9LS5uqyUPzKSJ7zj_R8Rki61m1WBhM'
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