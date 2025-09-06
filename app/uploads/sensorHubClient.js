const socket = io();
const root = document.getElementById('root');
const sensorsPage = document.getElementById('sensors-page');
const aboutPage = document.getElementById('about-page');
const navigation = document.getElementById('navigation');
navigation.addEventListener('click', router);
function router(e) {
  e.preventDefault();
  const isRoute = e.target.href != undefined;
  if(isRoute) {
    const isSensorPage = e.target.href == 'http://localhost:3000/sensors';
    isSensorPage ? renderSensorPage() : renderAboutPage();
  }
}
function renderSensorPage() {
  sensorsPage.style.display = 'flex';
  aboutPage.style.display = 'none';
}
function renderAboutPage() {
  sensorsPage.style.display = 'none';
  aboutPage.style.display = 'flex';
}

const display = document.getElementById('display');
const temperatureContainer = document.getElementById('temperature');
const humidityContainer = document.getElementById('humidity');
const co2Container = document.getElementById('co2');
const noiseContainer = document.getElementById('noise');
const aspirationContainer = document.getElementById('aspirationContainer');
const aspiration = document.getElementById('aspiration');
const airConditionContainer = document.getElementById('airConditionContainer');
const airCondition = document.getElementById('airCondition');

function updateDisplay(temperature, humidity, co2, noise, aspirationOn, airConditionOn) {
  if(aspirationOn == '1') {
    aspirationContainer.style.background = 'green';
    aspiration.textContent = 'Аспирация включена';
  } else {
    aspirationContainer.style.background = 'red';
    aspiration.textContent = 'Аспирация изключена';
  }

  if(airConditionOn == '1') {
    airConditionContainer.style.background = 'green';
    airCondition.textContent = 'Климатик включен';
  } else {
    airConditionContainer.style.background = 'red';
    airCondition.textContent = 'Климатик изключен';
  }

  temperatureContainer.textContent = temperature;
  humidityContainer.textContent = humidity;
  co2Container.textContent = co2;
  noiseContainer.textContent = noise;
}

let [temperature, humidity, co2, noise, analogNoiseVal, aspirationOn, airConditionOn] = ['', '', '', '', '512', '0', '0']; // analogNoiseVal INIT = "512" => The threshold point determining whether KY037 is 0(false, low) or 1(true, high).

socket.on('sensorHubData', (data) => {
  [temperature, humidity, co2, noise, analogNoiseVal, aspirationOn, airConditionOn] = data.split(', ');
  updateDisplay(temperature, humidity, co2, noise, aspirationOn, airConditionOn);
});

function getNoiseVal() {
  return Number(analogNoiseVal);
}

// noise graphic
Plotly.plot('chart', [
  {
    y: [getNoiseVal()],
    type: 'line'
  }
]);

setInterval(() => {
  Plotly.extendTraces('chart', { y: [[getNoiseVal()]] }, [0]);
}, 30);