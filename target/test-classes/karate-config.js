function fn() {
    var env = karate.env; // Lấy từ system property 'karate.env'
    karate.log('karate.env system property was:', env);

    var config = {
        baseUrl: 'https://reqres.in/api',
        timeout: 30000
    };

    // Cấu hình headers mặc định
    karate.configure('headers', {
        'Content-Type': 'application/json',
        'x-api-key': 'reqres-free-v1'
    });

    // Cấu hình timeout
    karate.configure('connectTimeout', 5000);
    karate.configure('readTimeout', 5000);

    // Log config
    karate.configure('logPrettyRequest', true);
    karate.configure('logPrettyResponse', true);

    // Cấu hình cho các môi trường khác nhau
    if (env == 'dev') {
        // Có thể thay đổi baseUrl nếu có dev environment
        config.baseUrl = 'https://reqres.in/api';
    } else if (env == 'prod') {
        config.baseUrl = 'https://reqres.in/api';
    }

    return config;
} 