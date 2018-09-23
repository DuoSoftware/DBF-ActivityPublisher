module.exports = {
    "Security": {
        "ip": "",
        "port": 6379,
        "user": "",
        "password": "",
        "mode": "instance", // instance, cluster, sentinel
        "sentinels": {
          "hosts": "",
          "port": 0,
          "name": "redis-cluster"
        }
    },
    "Host": {
        "resource": "cluster",
        "port": 3000
    },
    "Services": {
        "accessToken": "",
        "botServiceProtocol": "http",
        "botServiceHost": "",
        "botServicePort": "3639",
        "botServiceVersion": "1.0.0.0",
    },
    "Uploads": {
        "outputpath": "output"
    }
};