module.exports = {
    "Security": {
        "ip": "",
        "port": 6379,
        "user": "",
        "password": "",
        "mode": "instance",//instance, cluster, sentinel
        "sentinels": {
            "hosts": "",
            "port": 16389,
            "name": "redis-cluster"
        }
    },
    "Host": {
        "resource": "cluster",
        "port": 4646
    },
    "Mongo": {
        "ip": "",
        "port": "",
        "dbname": "",
        "password": "",
        "user": "",
        "cloudAtlas": true
    },
    "Services": {
        "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdWtpdGhhIiwianRpIjoiYWEzOGRmZWYtNDFhOC00MWUyLTgwMzktOTJjZTY0YjM4ZDFmIiwic3ViIjoiNTZhOWU3NTlmYjA3MTkwN2EwMDAwMDAxMjVkOWU4MGI1YzdjNGY5ODQ2NmY5MjExNzk2ZWJmNDMiLCJleHAiOjE5MDIzODExMTgsInRlbmFudCI6LTEsImNvbXBhbnkiOi0xLCJzY29wZSI6W3sicmVzb3VyY2UiOiJhbGwiLCJhY3Rpb25zIjoiYWxsIn1dLCJpYXQiOjE0NzAzODExMTh9.Gmlu00Uj66Fzts-w6qEwNUz46XYGzE8wHUhAJOFtiRo",
        "botServiceProtocol": "https",
        "botServiceHost": "",
        "botServicePort": "",
        "botServiceVersion": "1.0.0.0",
    },
    "Uploads": {
        "outputpath": "output"
    },
    "NPM": {
        "registryUrl": "https://registry.npmjs.com/",
        "username": "",
        "password": "",
        "email": "",
        "scope": "" 
    }
};
