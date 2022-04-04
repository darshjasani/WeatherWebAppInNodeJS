const http = require('http');
const fs = require('fs');
var requests = require('requests');
//const { hostname } = require('os');

const replaceVal = (tempVal,orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",(orgVal.main.temp - 273.15).toFixed(2));
    temperature = temperature.replace("{%tempmin%}",(orgVal.main.temp_min -  273.15).toFixed(2));
    temperature = temperature.replace("{%tempmax%}",(orgVal.main.temp_max -  273.15).toFixed(2));
    temperature = temperature.replace("{%city%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%icon%}",orgVal.weather[0].icon);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].description);

    //console.log(temperature);
    return temperature;
};
const homeFile = fs.readFileSync("home.html","utf-8");

const server = http.createServer((req,res)=>{
    if(req.url == "/"){
        requests('https://api.openweathermap.org/data/2.5/weather?q=Vadodara&appid=[ YOUR API KEY]')
        .on('data',(chunk)=> {
            const obj_data = JSON.parse(chunk);
            //const tem = document.getElementsByClassName("temp");
            const arry = [obj_data];
            const data1 = arry.map((val)=>{
                return replaceVal(homeFile,val);
            });
            //console.log("DT",data1);
            res.write(data1.join(""));
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();
        });
    }
});
const hostname = '127.0.0.1';
const port = 8000

server.listen(port,hostname,()=>{
    console.log(`Server running on http://${hostname}:${port}`);
});
