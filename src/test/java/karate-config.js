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
        bearerToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwODUxNWIwNS0yZDNlLTQ3ODktYWQ2MC1kYjM1NTI1YTQ5NzAiLCJ1c2VybmFtZSI6Im5hbSIsInJvbGUiOjAsImlhdCI6MTc1MDQzNzA3NCwiZXhwIjoxNzUwNDQwNjc0fQ.ValAjJfY-zgdhGLe4LS6-hvIaP1stHwmTalMhD06QkQ'
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