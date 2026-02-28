
const input=document.querySelector("input");
const submit=document.querySelector(".submit");
const h2=document.querySelector("h2");

const cityDiv=document.querySelector(".city");



const spinner= document.querySelector(".spinner-border")

const apierror=document.querySelector(".apierror");
const header=document.querySelector(".header");
const retry = document.querySelector("#retry");


function error(){
    apierror.style.display="flex";
    header.style.display="none";
     spinner.style.display="none";
}

retry.addEventListener("click", function(){
   submit.click();
   
})





async function getCity(x) {
    try{
        const response= await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${x}?key=VBW7THMQXKAG37XS3RZX7ZST8`)
        const cityData= await response.json();
return cityData.address;

    }catch{
         error();
    }

}

async function getCond(x) {
    try{ 
        const response= await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${x}?key=VBW7THMQXKAG37XS3RZX7ZST8`)
        const cityData= await response.json();
        
return cityData.currentConditions.conditions;
    }catch{
console.log("error");
    }

}


async function getTemp(x) {
    try{
        const response= await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${x}?key=VBW7THMQXKAG37XS3RZX7ZST8`)
        const cityData= await response.json();
return cityData.currentConditions.temp;
    }catch{
console.log("error");
    }

}
async function info(x){
    try{
         const response= await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${x}?key=VBW7THMQXKAG37XS3RZX7ZST8`)
          const cityData= await response.json()
          return {
        feelslike: cityData.currentConditions.feelslike,
        humid: cityData.currentConditions.humidity,
       wind: cityData.currentConditions.windspeed,
        visib: cityData.currentConditions.visibility,
        icon: cityData.currentConditions.icon
    } 
    }catch{
        console.log("eorror");
    }
}


let isCelsius = true;
let rawData = null;

function convert(f) {
    return isCelsius ? Math.floor((f - 32) / 1.8) + "°C" : Math.floor(f) + "°F";
}

document.querySelectorAll(".dropdown-item").forEach(item => {
    item.addEventListener("click", function () {
        const text = this.textContent.trim();
        if (text === "Celsius") isCelsius = true;
        if (text === "Fahrenheit") isCelsius = false;
        if (rawData) renderAll();
    });
});



const content=document.querySelector(".content");
const condi=document.querySelector("#condi");
const leftside=document.querySelector(".leftside")
const right=document.querySelector(".right");
const input1=document.querySelector("input");


const p=document.querySelector("#temp p")

submit.addEventListener("click", async function(e){

  e.preventDefault();

    if (input1.value==="") {
        input1.style.outline="1px solid red";
        return;

    }
    input1.style.outline="none";

     apierror.style.display="none";
    header.style.display="flex";
content.style.display="none"
spinner.style.display="block";


const n = await getCity(input.value);
if (!n) return;
const t = await getTemp(input.value);


const capitalized= n.charAt(0).toUpperCase() + n.slice(1);
const infoData = await info(input.value);

const cond= await getCond(input.value);

await getDays(input.value);
await renderDays(input.value);
await renderhours(input.value);


right.style.display="flex";
 leftside.style.display="flex";
content.style.display="flex";
spinner.style.display="none";

let celsius=t;
h2.textContent=capitalized;
condi.textContent=cond;

p.textContent=`${convert(t)}`;
const first= document.querySelector("#first");
first.src=`${infoData.icon}.webp`

let t2=infoData.feelslike;
let celsi=t2;
document.querySelector(".feels").innerHTML = `<h1>Feels Like</h1><p>${convert(celsi)}</p>`;
document.querySelector(".humid").innerHTML=`<h1>Humidity</h1><p>${infoData.humid}%</p>`;
document.querySelector(".uv").innerHTML=`<h1>Uv Index</h1><p>${infoData.wind} km/h</p>`
document.querySelector(".visib").innerHTML=`<h1>Visibility</h1><p>${infoData.visib}</p>`

  const days = await getDays(input.value);
    getHours(days[0]);

})





async function getDays(x){
    try{ const data= await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${x}?key=VBW7THMQXKAG37XS3RZX7ZST8`)
const day = await data.json();
return day.days;
    }
    catch {
        console.log("error");
    }

}

async function renderDays(x) {
    const days= await getDays(x);
    const daydivs=document.querySelectorAll(".day");
  

    daydivs.forEach((div,i)=>{
        const day= days[i];
        const date = new Date(day.datetime);
const daydate=date.toLocaleDateString("en-US", { weekday: "long" });

let celmin=day.feelslikemin;
let celmax=day.feelslikemax;

        div.innerHTML=`<h1>${daydate}</h1>
        <img src="${day.icon}.webp"></img>
        <div class="forecastTemp">
        <p>${convert(celmin)}</p>
        <p>${convert(celmax)}</p></div>`
    })
}


async function renderhours(x) {
    const days= await getDays(x);
const lis= document.querySelectorAll(".hour");
lis.forEach((li,i)=>{
    const day=days[i];
    const date = new Date(day.datetime);
const daydate=date.toLocaleDateString("en-US", { weekday: "long" });
const daybtn=document.querySelector(".dayd")
li.textContent=`${daydate}`
const hourlyforecast=document.querySelector(".hourlyforecast")

li.addEventListener("click", function(e){
    daybtn.textContent=`${daydate}`
    getHours(day);
 

})

})
}

async function getHours(x) {
    
const rightcontent = document.querySelector(".rightcontent");
rightcontent.innerHTML="";
const hours=x.hours;

 hours.forEach((hour,j)=>{
const div=document.createElement("div");
const time=`${hour.datetime}`;
let clock=parseInt(time.split(":")[0], 10);
if(clock > 12){
    clock=clock +" PM"
}else {
    clock=clock +" AM"
}

let cels=hour.feelslike;
div.classList.add("hourdiv");
div.innerHTML=`
<div class="headhour">
<img src="${hour.icon}.webp"></img>
<h1>${clock}</h1>
</div>
<h2>${convert(cels)}</h2>`
rightcontent.append(div);
 })

}












































async function getCi() {
    try{
        const response= await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/london?key=VBW7THMQXKAG37XS3RZX7ZST8`)
        const cityData= await response.json();
console.log(cityData);
    }catch{
console.log("error");
    }

}

getCi();

