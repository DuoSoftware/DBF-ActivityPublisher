module.exports = {
    "Security": {
        "ip": "104.198.29.50",
        "port": 6379,
        "user": "duo",
        "password": "DuoS123",
        "mode": "instance",//instance, cluster, sentinel
        "sentinels": {
            "hosts": "138.197.90.92,45.55.205.92,138.197.90.92",
            "port": 16389,
            "name": "redis-cluster"
        }
    },
    "Host": {
        "resource": "cluster",
        "port": 3000
    },
    "Mongo": {
        "ip": "sf-development-1q2bv.gcp.mongodb.net/dbfdb?retryWrites=true",
        "port": "27017",
        "dbname": "dbfdb",
        "password": "DuoS123",
        "user": "sfuser",
        "cloudAtlas": true
    },
    "Services": {
        "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo",
        "botServiceProtocol": "https",
        "botServiceHost": "smoothbotservicesdev.plus.smoothflow.io",
        "botServicePort": "3639",
        "botServiceVersion": "1.0.0.0",
    },
    "Uploads": {
        "outputpath": "output"
    },
    "NPM": {
        "registryUrl": "https://registry.npmjs.com/",
        "username": "",
        "password": "",
        "email": ""
    }
};