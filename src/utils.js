const uaList = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246',
    'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36',
    'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
    'Mozilla/5.0 (Linux; Android 7.0; Pixel C Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/52.0.2743.98 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:83.0) Gecko/20100101 Firefox/83.0',
];


const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const randomNumber = (min, max) => {
    return Math.random() * (max - min) + min; 
};

const getUA = () => {
    return uaList[Math.floor(Math.random() * uaList.length)];
};

const getProxy = (proxies) => {
    return proxies[Math.floor(Math.random() * proxies.length)];
};

module.exports = {
    sleep: sleep,
    randomNumber: randomNumber,
    getUA: getUA,
    getProxy: getProxy
};