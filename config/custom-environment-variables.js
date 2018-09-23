module.exports = {
    "Security": {
        "ip": "SYS_REDIS_HOST",
        "port": "SYS_REDIS_PORT",
        "user": "SYS_REDIS_USER",
        "password": "SYS_REDIS_PASSWORD",
        "mode": "SYS_REDIS_MODE",
        "sentinels": {
            "hosts": "SYS_REDIS_SENTINEL_HOSTS",
            "port": "SYS_REDIS_SENTINEL_PORT",
            "name": "SYS_REDIS_SENTINEL_NAME"
        }

    },
    "Host": {
        "port": "HOST_PORT"
    },
    "Services": {
        "accessToken": "GLOBAL_TOKEN",
        "botServiceProtocol": "BOT_SERVICE_PROTOCOL",
        "botServiceHost": "BOT_SERVICE_HOST",
    },
    "Uploads": {
        "outputpath": "ACTIVITY_OUTPATH"
    }
};