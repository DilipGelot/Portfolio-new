// Scroll Event
window.addEventListener("scroll", function () {
  const header = document.getElementById("header");
  if (this.window.pageYOffset > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Humburger Menu  ***********************

var icon = document.getElementById("humburger_icon");
var menuBox = document.getElementById("menu-box");
icon.onclick = function () {
  menuBox.classList.toggle("open-menu");
};

// Close mobile menu when clicking a link
const menuLinks = menuBox.querySelectorAll("a");
menuLinks.forEach(link => {
  link.onclick = function () {
    menuBox.classList.remove("open-menu");
  };
});

// Typing Text    ************************

const words = ["Founder @ TheOrbexa", "Full-Stack Developer", "AI Developer", "SaaS Developer", "Mobile App Developer", "Website Developer"];
let j = 0;
let timer;

function typingEffect() {
  let word = words[j].split("");
  var loopTyping = function () {
    if (word.length > 0) {
      document.getElementById("word").innerHTML += word.shift();
    } else {
      deletingEffect();
      return false;
    }
    timer = setTimeout(loopTyping, 200);
  };
  loopTyping();
}

function deletingEffect() {
  let word = words[j].split("");
  var loopDeleting = function () {
    if (word.length > 0) {
      word.pop();
      document.getElementById("word").innerHTML = word.join("");
    } else {
      if (words.length > j + 1) {
        j++;
      } else {
        j = 0;
      }
      typingEffect();
      return false;
    }
    timer = setTimeout(loopDeleting, 100);
  };
  loopDeleting();
}

typingEffect();

//  Project Slider            ********************************************

//  Project Filtering logic            ********************************************

document.addEventListener("DOMContentLoaded", () => {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach((b) => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.style.display = "block";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.opacity = "1";
          }, 50);
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});



// ************ Dark mode *********

const chkDesktop = document.getElementById("theme-toggle-desktop");
const chkMobile = document.getElementById("theme-toggle-mobile");

function setTheme(isDark) {
  if (isDark) {
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
    if (chkDesktop) chkDesktop.checked = true;
    if (chkMobile) chkMobile.checked = true;
  } else {
    document.body.classList.remove("dark");
    localStorage.setItem("theme", "light");
    if (chkDesktop) chkDesktop.checked = false;
    if (chkMobile) chkMobile.checked = false;
  }
}

// Initial theme check
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
  setTheme(true);
} else {
  setTheme(false);
}

if (chkDesktop) {
  chkDesktop.addEventListener("change", (e) => {
    setTheme(e.target.checked);
  });
}

if (chkMobile) {
  chkMobile.addEventListener("change", (e) => {
    setTheme(e.target.checked);
  });
}

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
const getWeather = (city) => {
  cityName.innerHTML = city;
  fetch(
    "https://weatherapi-com.p.rapidapi.com/current.json?q=53.1%2C-0.13?city=" +
    city,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      wind_kph.innerHTML = response.current.wind_kph;
      pressure_in.innerHTML = response.current.pressure_in;
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
    })
    .catch((err) => console.log(err));
};
submits.addEventListener("click", (e) => {
  e.preventDefault();
  if (city.value.length == 0) {
    alert("Please Enter a City Name");
  } else {
    getWeather(city.value);
    city.value = "";
    if (typeof app !== "undefined") app.style.opacity = "0";
  }
});

getWeather("Ahmedabad gujarat");
