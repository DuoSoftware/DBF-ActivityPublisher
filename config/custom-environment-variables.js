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
    "Mongo":
        {
            "ip":"SYS_MONGO_HOST",
            "port":"SYS_MONGO_PORT",
            "dbname":"SYS_MONGO_DB",
            "password":"SYS_MONGO_PASSWORD",
            "user":"SYS_MONGO_USER",
            "replicaset" :"SYS_MONGO_REPLICASETNAME",
            "cloudAtlas": "SYS_MONGO_CLOUDATLAS"
        },
    "Services": {
        "accessToken": "GLOBAL_TOKEN",
        "botServiceProtocol": "BOT_SERVICE_PROTOCOL",
        "botServiceHost": "BOT_SERVICE_HOST",
    },
    "Uploads": {
        "outputpath": "ACTIVITY_OUTPATH"
    },
    "NPM": {
        "registryUrl": "NPM_REGISTRY_URL",
        "username": "NPM_USERNAME",
        "password": "NPM_PASSWORD",
        "email": "NPM_EMAIL",
        "scope": "NPM_SCOPE"
    }
};