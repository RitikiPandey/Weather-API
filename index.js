const http = require("http");
const fs = require("fs");
var requests = require("requests")

const homeFile = fs.readFileSync("home.html","utf-8"); 

const replaceVal = (tempVal,orgVal) => {
    let temperature = tempVal.replace("{%tempval%}",Math.round(orgVal.main.temp-273.15));
    temperature = temperature.replace("{%tempmin%}",Math.round(orgVal.main.temp_min-273.15));
    temperature = temperature.replace("{%tempmax%}",Math.round(orgVal.main.temp_max-273.15));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req,res)=>{
    if(req.url=="/")
    {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Patna&appid=d51a7b189080e1f52aa455c7ffcfd7e1")
        .on("data",(chunk)=>{
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            // console.log(arrData[0].main.temp-273.15);
            const realTimeData = arrData.map((val)=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
        })
        .on("end",(err)=>{
            if(err) return console.log("Connection closed due to errors",err);
            res.end();
        });
    }
});

server.listen(3000,"127.0.0.1");