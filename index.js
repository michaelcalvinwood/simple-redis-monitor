const redis = require('redis');
const fs = require('fs');

const sleep = ms => new Promise(r => setTimeout(r, ms));

const reportKeys = async () => {
    while (true) {
        let rawdata = fs.readFileSync('redisList.json');
        let ips = JSON.parse(rawdata);
        let clients = [];
        let usedMemory;
        for (let i = 0; i < ips.length; ++i) {
            //console.log(`checking ${ips[i]}`);
            
            try {
                    clients[i] = redis.createClient({
                       url: `redis://@${ips[i]}:6379`
                    }); 
                    //console.log(clients[i]);
                    clients[i].on('connect', async () => {
                        //console.log(`${ips[i]} connected`);
                        let result = await clients[i].DBSIZE();
                        let info = await clients[i].info();
                        info.split("\n").map((line) => {
                            if (line.match(/used_memory_human:/)) {
                                usedMemory = line.split(":")[1];
                                
                            }
                        });
                        console.log(`[${new Date().toLocaleTimeString()}] ${ips[i]}: ${result} keys using ${usedMemory} memory`)
                        clients[i].quit();
                    })
                    await clients[i].connect();
            } catch (err) {
                console.error(`${ips[i]}: ${err.message}`);
            }
        }

        await sleep(1 * 60 * 1000);
        console.log('-------------------------------------------');
    }

    
}

reportKeys();
