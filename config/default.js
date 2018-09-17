module.exports = {
    "Host": {
        "resource": "cluster",
        "port": 3000
    },
    "Security": {
        "ip": "",
        "port": 0,
        "user": "",
        "password": "",
        "mode": "sentinel", // instance, cluster, sentinel
        "sentinels": {
            "hosts": "",
            "port": 0,
            "name": "redis-cluster"
        }
    },
    "Uploads": {
        "outputpath": "output"
    }
};