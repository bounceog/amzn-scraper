require('dotenv').config();

const url = require('url')
const fetch = require('node-fetch');
const HttpsProxyAgent = require('https-proxy-agent');
const AbortController = require('abort-controller');
const cheerio = require('cheerio');
const { Webhook } = require('discord-webhook-node');

const { sleep, randomNumber, getUA, getProxy } = require('./utils');

class Task {
    constructor(id, url, proxies) {
        this.id = id;
        this.url = url;
        this.proxies = proxies;
        this.hook = new Webhook(process.env.WEBHOOK_URI);
    }

    async run() {
        try {
            const price = await this.load(getProxy(this.proxies));
            
            return { id: this.id, price: parseFloat(price) };
        } catch (error) {
            this.trackError();
        }
    }

    async load(proxy = undefined) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const opts = {
            method: 'get',
            headers: {
                'dnt': '1',
                'upgrade-insecure-requests': '1',
                'user-agent': getUA(),
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-user': '?1',
                'sec-fetch-dest': 'document',
                'referer': 'https://www.amazon.com/',
                'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
            },
            signal: controller.signal
        };

        if(typeof proxy != 'undefined') {
            var proxyOpts = url.parse(proxy.ip);
            proxyOpts.auth = proxy.auth;
            opts.agent = new HttpsProxyAgent(proxyOpts);
        }

        let res;

        try {
            res = await fetch(this.url, opts);
        } catch (error) {
            if (error.name === 'AbortError') {
                clearTimeout(timeout);
                return await this.load(getProxy(this.proxies));
            }
        }
        
        if(res.ok) {
            try {
                const html = await res.text();

                const $ = cheerio.load(html, {
                    xml: {
                        withDomLvl1: true,
                        normalizeWhitespace: true,
                        xmlMode: true,
                        decodeEntities: false
                    }
                });

                if(!html) throw new Error('');
                
                if($('#productTitle')) {
                    const price = $('#priceblock_ourprice').html().trim().split(' €')[0].replace(',', '.');

                    if(price) return price;
                    else return 'OOS';
                } else throw new Error('');
            } catch (error) {
                await sleep(randomNumber(5000, 15000));
                return await this.load(getProxy(this.proxies));
            }
        } else {
            await sleep(randomNumber(5000, 15000));
            return await this.load(getProxy(this.proxies));
        }
    }

    trackError() {
        this.hook.error('**Error**', 'Something went wrong!', 'Check DB');
    }
}

process.on('message', (message) => {
    new Task(message.id, message.url, message.proxies)
        .run()
        .then((credentials) => {
            process.send({ id: credentials.id, price: credentials.price});
        })
        .catch((err) => {});
});