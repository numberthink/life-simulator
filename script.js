const maxAge = 140;
const ageSimulationResult = document.getElementById('ageSimulationResult');
const ageFeedback = document.getElementById('ageFeedback');
const ageInput = document.getElementById('ageInput');
const runSimulationButton = document.getElementById('runSimulationButton');
const yearsRemaining = document.getElementById('yearsRemaining');
const dieDate = document.getElementById('dieDate');
const dieTime = document.getElementById('dieTime');
const currentAgeDisplay = document.getElementById('currentAge');
const finalAgeDisplay = document.getElementById('finalAge');
const timeSpeedSlider = document.getElementById('timeSpeedSlider');
const timeSpeedInput = document.getElementById('timeSpeedInput');
const currentTimeContainer = document.getElementById('currentTimeContainer');
const timeMultiplierValue = document.getElementById('timeMultiplierValue');
const youAreDeadDialog = document.getElementById('youAreDead');
const resetSimulationButton = document.getElementById('resetSimulationButton');
const noAgeInput = document.getElementById('noAgeInput');

const appState = {
    elapsedTime: 0,
    ticking: false,
    startTime: 0,
    lastSimulationStartDate: 0,
    lastSimulationStartTime: 0,
    simulationEndDate: 0,
    simulationEnded: false,
    timeSpeed: 1,
    timeSpeedUpdated: false,
    lastTimeUpdate: 0,
    simulationStarted: false,
}

document.getElementById('noAgeInput').onchange = function() {
    ageInput.disabled = this.checked;
    if (this.checked) {
        ageFeedback.textContent = `No problem, you'll get a random age.`;
        showRunSimulationButton();
    }
    else {
        onAgeUpdate();
    }
};

const onAgeUpdate = (value) => {
    let age;
    if (!value) {
        age = ageInput.value;
    }
    else {
        age = value;
    }
    let ageFeedbackMsg = '';
    let simulationReady = false;
    if (!age) {
        // pass
    }
    else if (age>maxAge) {
        ageFeedbackMsg = `Hmm. That's really old! Wanna double check that?`;
    }
    else if (age>=30) {
        ageFeedbackMsg = 'Really? You look good for your age!';
        simulationReady = true;
    }
    else {
        ageFeedbackMsg = 'Thanks for giving your age!';
        simulationReady = true;
    }
    ageFeedback.textContent = ageFeedbackMsg;
    if (simulationReady) {
        showRunSimulationButton();
    }
    else {
        hideRunSimulationButton();
    }
}

ageInput.onchange = function() {
    onAgeUpdate(this.value);
}

const showRunSimulationButton = () => {
    runSimulationButton.style.visibility = 'visible';
    
}

const hideRunSimulationButton = () => {
    runSimulationButton.style.visibility = 'hidden';
}


runSimulationButton.onclick = function() {
    runSimulation();
}

const runSimulation = () => {
    if (appState.simulationStarted) {
        resetSimulation();
    }
    appState.simulationStarted = true;
    runAgeRandomizer();
}

const resetSimulation = () => {
    // resets everything except for age input
    appState.simulationStarted = false;
    appState.timeSpeedUpdated = false;
    appState.lastTimeUpdate = 0;
    appState.lastTimeCheck = 0;
    appState.simulationEnded = false;
    appState.timeSpeed = 1;
    appState.simulationEnded = false;
    appState.showTime = false;
    yearsRemaining.textContent = '';
    dieDate.textContent = '';
    dieTime.textContent = '';
    currentAgeDisplay.textContent = '';
    finalAgeDisplay.textContent = '';
    timeSpeedSlider.value = 1;
    ageSimulationResult.visibility = 'hidden';
    timeSpeedInput.style.visibility = 'hidden';
    currentTimeContainer.style.visibility = 'hidden';
    ageSimulationResult.style.visibility = 'hidden';
    timeMultiplierValue.textContent = 'x 1';
    if (youAreDeadDialog.open) {
        youAreDeadDialog.close();
    }
    youAreDeadDialog.style.visibility = 'hidden';

}

const runAgeRandomizer = async() => {
    ageSimulationResult.style.visibility = 'visible';

    // https://www.ssa.gov/oact/STATS/table4c6.html
    const ageMap = await readJSON();

    let currentAge;
    if (noAgeInput.checked) {
        currentAge = Math.floor(Math.random()*100);
    }
    else {
        currentAge = parseInt(ageInput.value);
    }
    let finalAge = parseInt(currentAge);
    for (let i=currentAge;i<140;i++) {
        let deathChance = (ageMap['death_prob_male']?.[i] + ageMap['death_prob_female']?.[i])/2;
        const ageMapLength = ageMap['death_prob_male'].length
        if (i>ageMapLength-1) {
            deathChance = (ageMap['death_prob_male'][ageMapLength-1] + ageMap['death_prob_female'][ageMapLength-1])/2;
        }

        if (Math.random()<deathChance) {
            break;
        }
        finalAge = i;

    }
    // add 1 year so no one dies right away (RIP)
    finalAge =finalAge+1;

    currentAgeDisplay.textContent = String(currentAge);
    finalAgeDisplay.textContent = String(finalAge);

    let yearsLeft = finalAge - currentAge;

    const dateNow = new Date();
    appState.lastSimulationStartDate = dateNow;
    appState.lastSimulationStartTime = appState.elapsedTime;

    const fullYear = dateNow.getFullYear();
    const endDate = new Date(dateNow.setFullYear(fullYear + yearsLeft));

    appState.simulationEndDate = endDate;

    yearsRemaining.textContent = String(yearsLeft);
    dieDate.textContent = endDate.toLocaleDateString();
    dieTime.textContent = endDate.toLocaleTimeString();

    ageSimulationResult.style.visibility = 'visible';

    showTime();

}

async function readJSON() {
    const response = await fetch("files/life_expectancy.json");
    const json = await response.json();
    return json;
}


const startTick = () => {
    appState.ticking = true;
    appState.startTime = window.performance.now()/1000;
    tick();

}

const tick = () => {
    appState.elapsedTime = (window.performance.now() - appState.startTime)/1000;
    if (appState.showTime) {
        updateTime(appState.elapsedTime);
    }
    window.requestAnimationFrame(tick)
}

const showTime = () => {
    if (!appState.ticking) {
        startTick();
    }
    appState.showTime = true;

    timeSpeedInput.style.visibility = 'visible';
    currentTimeContainer.style.visibility = 'visible';

}

const updateTime = (elapsedTime) => {

    let dateNow = new Date();

    if (appState.timeSpeedUpdated) {
        if (!appState.lastTimeUpdate) {
            appState.lastTimeUpdate = Date.now();
        }
        if (!appState.lastTimeCheck) {
            appState.lastTimeCheck = appState.elapsedTime;
        }

        const actualSecondsSinceLastUpdate = appState.elapsedTime - appState.lastTimeCheck;
        const fakeSecondsSinceLastUpdate = actualSecondsSinceLastUpdate*appState.timeSpeed;

        const dateNowUTC = appState.lastTimeUpdate + fakeSecondsSinceLastUpdate*1000;
        appState.lastTimeUpdate = dateNowUTC;

        dateNow = new Date(dateNowUTC);
        appState.lastTimeCheck = appState.elapsedTime;
    }

    if (dateNow>=appState.simulationEndDate) {
        dateNow = appState.simulationEndDate;
        endSimulation();
    }

    currentTime.textContent = dateNow.toLocaleDateString("en",
    {year: "numeric",month:"2-digit",day: "2-digit"}) + ' ' + dateNow.toLocaleTimeString("en",{
        minute: "2-digit",
        second: "2-digit",
        hour: "2-digit"
    });
}

const endSimulation = () => {

    appState.showTime = false;
    appState.simulationEnded = true;
    youAreDeadDialog.style.visibility = 'visible';
    youAreDeadDialog.showModal();
}


if (resetSimulationButton) {
    resetSimulationButton.addEventListener('click',() => {
        resetSimulation();
    })
}


timeSpeedSlider.onchange = function() {
    appState.timeSpeed = this.value;
    if (!appState.timeSpeedUpdated) {
        appState.timeSpeedUpdated = true;
    }
    let timeMultiplerString = appState.timeSpeed < 1000 ? 
    String(appState.timeSpeed) + '' :
    appState.timeSpeed < 1000000 ?
    String(Math.round(appState.timeSpeed/1000)) + 'k'  :
    String(Math.round(appState.timeSpeed/1000000)) + 'm';


    timeMultiplerString = 'x ' + timeMultiplerString;

    timeMultiplierValue.textContent = timeMultiplerString;
}

const addAboutButtonListener = () => {
    const aboutButton = document.getElementById('aboutButton');
    aboutButton.addEventListener('click', () => {
        showAboutContent();
    });
    const closeAboutButton = document.getElementById('closeAboutContent');
    closeAboutButton.addEventListener('click',() => {
        closeAboutContent();
    })
}

const showAboutContent = () => {
    document.getElementById('aboutContent').show();

}

const closeAboutContent = () => {
    document.getElementById('aboutContent').close();
}

addAboutButtonListener();
