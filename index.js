const redis = require('redis');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const reportKeys = () => {
    while (true) {
        let rawdata = fs.readFileSync('redisList.json');
        let ips = JSON.parse(rawdata);
        let clients = [];
        for (let i = 0; i < ips.length; ++i) {
            clients[i] = redis.createClient();
            clients[i].on('connect', async () => {
                let result = await clients[i].dbsize();
                console.log(`[${new Date().toLocaleTimeString()}] ${ip}: ${result} keys`)
                clients[i].quit();
            })
        }
    }

    await sleep(60000);
}

reportKeys();
