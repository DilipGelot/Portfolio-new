// Scroll Event
window.addEventListener("scroll", function(){
if(this.window.pageYOffset>50)
{
    document.getElementById("header").style.boxShadow  = "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px";
}
else{
    document.getElementById("header").style.boxShadow  = "none";
}
})


// Humburger Menu  ***********************

var icon = document.getElementById("humburger_icon");
var menuBox = document.getElementById("menu-box");  
icon.onclick = function(){
    menuBox.classList.toggle("open-menu")
}

// Typing Text    ************************


const words = ["Frontend Developer","React JS Developer", "Web Designer"];
let j = 0;
let timer;

function typingEffect() {
	let word = words[j].split("");
	var loopTyping = function() {
		if (word.length > 0) {
			document.getElementById('word').innerHTML += word.shift();
		} else {
			deletingEffect();
			return false;
		};
		timer = setTimeout(loopTyping, 200);
	};
	loopTyping();
};


function deletingEffect() {
	let word = words[j].split("");
	var loopDeleting = function() {
		if (word.length > 0) {
			word.pop();
			document.getElementById('word').innerHTML = word.join("");
		} else {
			if (words.length > (j + 1)) {
				j++;
			} else {
				j = 0;
			};
			typingEffect();
			return false;
		};
		timer = setTimeout(loopDeleting, 100);
	};
	loopDeleting();
};

typingEffect();







//  Project Slider            ******************************************** 

let slideIndex = 1;
showSlides(slideIndex);

function plusSlide(n) {
  showSlides(slideIndex += n);
}

function currentslide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }

  slides[slideIndex-1].style.display = "block";  

}





// ************   Contact Form        ******************

let msg_box = document.getElementById("contact_form");

document.getElementById("connect").onclick = function(){
	msg_box.style.display = "flex";
}
document.getElementById("close").onclick = function(){
	msg_box.style.display = "none";
}

 // ************ Dark mode *********

 const chk = document.getElementById('chk');

chk.addEventListener('change', () => {
	document.body.classList.toggle('dark');
});


// ************ Weather *********

const url =
  "https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13?city=deesa";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "57f4fe7da6mshd3e382af8174145p174e3ajsn506f7f40713b",
    "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
  },
};
const getWeather = (city)=>{
    cityName.innerHTML = city;
    fetch('https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13?city='+city, options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        wind_kph.innerHTML = response.current.wind_kph;
        // wind_degree.innerHTML = response.current.wind_degree;
        pressure_in.innerHTML = response.current.pressure_in;
        // precip_in.innerHTML = response.current.precip_in;
        humidity.innerHTML = response.current.humidity;
        cloud.innerHTML = response.current.cloud;
        feelslike_c.innerHTML = response.current.feelslike_c;
        uv.innerHTML = response.current.uv;
        temp_c.innerHTML = response.current.temp_c;
        cityName.innerHTML = response.location.name;
        time.innerHTML = response.location.localtime;
        country.innerHTML = response.location.country;
        region.innerHTML = response.location.region;
        tz_id.innerHTML = response.location.tz_id;
        text.innerHTML = response.current.condition.text;
        // icon.innerHTML = response.current.condition.icon;
        
    })
    .catch((err) => console.log(err));
}
submits.addEventListener("click", (e) => {
    e.preventDefault();
    if(city.value.length == 0){
        alert("Please Enter a City Name");
    }
    else{

        getWeather(city.value)
        city.value="";
        app.style.opacity="0";
    }
})

getWeather("Deesa");