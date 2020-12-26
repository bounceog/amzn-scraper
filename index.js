require('dotenv').config();

const fs = require('fs');
const cron = require('node-cron');
const { fork } = require('child_process');

const MongoHandler = require('./src/handler/mongo-handler');
const mongoHandler = new MongoHandler(process.env.MONGO_URI);

const run = (id, url, proxies) => {
    const task = fork('./src/Task.js');

    task.on('message', (message) => {
        if(message) {
            mongoHandler.update(message.id, message.price)
                .then((data) => console.log(data))
                .catch((err) => console.log(err))
        };
    });

    task.send({ id: id, url: url, proxies: proxies });
};

const init = () => {
    fs.readFile('proxies.txt', 'utf8', function(err, contents) {
        const rows = contents.split('\r\n');
        const proxies = [];

        rows.forEach((item) => {
            const split = item.split(':');

            proxies.push({
                ip: `http://${split[0]}:${split[1]}`,
                auth: `${split[2]}:${split[3]}`
            });
        });

        mongoHandler.getAllProducts()
            .then((products) => {
                products.forEach((product) => {
                    run(product.id, product.url, proxies);
                });
            })
            .catch((err) => {
                console.log(err);
            });
    });
};

cron.schedule('0 12 * * *', init);