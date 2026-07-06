let grid = document.getElementById("grid");
let birth = [3];
let survival = [2, 3];
let pause = true;
let gen = 0;
let population = 0;
let deaths = 0;
let births = 0;
let width = 25;
let height = 25;
let nextStates = [];
let speed = 0.2;
let ageArray = [];
let deathArray = [];
let ageVisualization = true;
let deathVisualization = true;
let history = [];
let maxHistory = 100;
let countGeneration = true;
let density = 50;
let squareSize = 15;
let maxCellSize = 15;
let minCellSize = 2;
let cells = [];
let toroidalGrid = true;
let gridCreated = false;
let cellVisualization = false;

let appliedSettings = {
  width: "25",
  height: "25",
  birth: "3",
  survival: "2,3",
  speed: "0.2",
  density: "50",
  squareSize: "15",
  cellColor: "#fff8ec",
  ageVisualization: true,
  deathVisualization: true,
  toroidalGrid: true,
  cellVisualization: true,
};

document.addEventListener("mousedown", () => {
  mouseDown = true;
});

document.addEventListener("mouseup", () => {
  mouseDown = false;
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getGridState = () => {
  let state = "";

  for (let i = 0; i < cells.length; i++) {
    state += cells[i].classList.contains("livingCell") ? "1" : "0";
  }

  return state;
};

const checkUnsavedChanges = () => {
  const changed =
    document.getElementById("width").value !== appliedSettings.width ||
    document.getElementById("height").value !== appliedSettings.height ||
    document.getElementById("birth").value.trim() !== appliedSettings.birth ||
    document.getElementById("survival").value.trim() !==
      appliedSettings.survival ||
    document.getElementById("speed").value.trim() !== appliedSettings.speed ||
    document.getElementById("density").value !== appliedSettings.density ||
    document.getElementById("squareSize").value !==
      appliedSettings.squareSize ||
    document.getElementById("cellColor").value !== appliedSettings.cellColor ||
    document.getElementById("ageVisualization").checked !==
      appliedSettings.ageVisualization ||
    document.getElementById("idVisualization").checked !==
      appliedSettings.cellVisualization ||
    document.getElementById("deathVisualization").checked !==
      appliedSettings.deathVisualization ||
    document.getElementById("toroidalGridMode").checked !==
      appliedSettings.toroidalGrid;

  if (changed) {
    showSaved();
  } else {
    hideSaved();
  }
};

const startPaint = (id) => {
  let cell = cells[id];

  paintAlive = cell.classList.contains("deadCell");

  toggleLiving(id, paintAlive);
};

const dragPaint = (id) => {
  if (!mouseDown) return;

  toggleLiving(id, paintAlive);
};

const calculateCellSize = (cols, rows, squareSide) => {
  let size = Math.min(maxCellSize, squareSide / cols, squareSide / rows);
  size = Math.max(minCellSize, size);

  return size;
};

const applyCellSize = () => {
  const container = document.getElementById("content") || document.body;
  const gridContainer = document.getElementById("gridContainer");

  const containerPadding =
    parseFloat(getComputedStyle(gridContainer).paddingLeft) * 2;

  const availableWidth = container.clientWidth - containerPadding - 20;
  const availableHeight = container.clientHeight - containerPadding - 20;
  const squareSide = Math.min(availableWidth, availableHeight);

  const size = calculateCellSize(width, height, squareSide);

  grid.style.setProperty("--cell-size", `${size}px`);
};

const buildGrid = (width, height) => {
  gridCreated = true;
  pause = true;
  pauseCheck();
  countGeneration = true;
  gen = 0;
  deaths = 0;
  population = 0;
  births = 0;
  document.getElementById("deaths").innerHTML = `deaths = [${deaths}]`;
  document.getElementById("births").innerHTML = `births = [${births}]`;
  document.getElementById("gen").innerHTML = `gen = [${gen}]`;
  document.getElementById("population").innerHTML =
    `population = [${population}]`;
  hideEstWarning();
  history.length = 0;
  ageArray = [];
  deathArray = [];
  grid.innerHTML = "";

  grid.style.gridTemplateColumns = `repeat(${width}, var(--cell-size))`;
  grid.style.gridAutoRows = "var(--cell-size)";
  grid.style.border = "7px solid #020018";

  applyCellSize();
  let html = "";

  if (cellVisualization) {
    for (let i = 0; i < width * height; i++) {
      html += `
<div
    id="${i}"
    class="deadCell cell"
    onmousedown="startPaint(${i})"
    onmouseenter="dragPaint(${i})"><p style="visibility: visible;">${i}</p>
</div>`;
    }
  } else {
    for (let i = 0; i < width * height; i++) {
      html += `
<div
    id="${i}"
    class="deadCell cell"
    onmousedown="startPaint(${i})"
    onmouseenter="dragPaint(${i})"><p style="visibility: hidden;">${i}</p>
</div>`;
    }
  }

  grid.innerHTML = html;

  cells = [...grid.children];

  cells[0].style.borderTopLeftRadius = "8px";
  cells[width - 1].style.borderTopRightRadius = "8px";
  cells[width * (height - 1)].style.borderBottomLeftRadius = "8px";
  cells[width * height - 1].style.borderBottomRightRadius = "8px";
};

window.addEventListener("resize", () => {
  applyCellSize();
});

const toggleLiving = (id, state = null) => {
  let cell = document.getElementById(id);
  let makeAlive = state === null ? cell.classList.contains("deadCell") : state;

  if (makeAlive) {
    cell.classList.remove("deadCell");
    cell.classList.add("livingCell");

    cell.classList.remove(...corpseClasses);
    let deathIdx = deathArray.findIndex((it) => it.id === id);
    if (deathIdx !== -1) deathArray.splice(deathIdx, 1);
  } else {
    cell.classList.remove("livingCell");
    cell.classList.add("deadCell");

    cell.classList.remove(...stageClasses);
    let idx = ageArray.findIndex((it) => it.id === id);
    if (idx !== -1) ageArray.splice(idx, 1);

    cell.classList.remove(...corpseClasses);
    let deathIdx = deathArray.findIndex((it) => it.id === id);
    if (deathIdx !== -1) deathArray.splice(deathIdx, 1);
  }
};

const randomize = () => {
  pause = true;
    let s = squareSize
  if (s > width)  {
    s = width
  } else if (s > height) {
    s = height
  }
  pauseCheck();
  createGrid();
  let startId =
    Math.floor(height / 2 - s / 2) * width +
    Math.floor(width / 2 - s / 2);
  for (let row = 0; row < s; row++) {
    for (let col = 0; col < s; col++) {
      let id = startId + row * width + col;
      let cell = document.getElementById(id);
      if (cell && Math.random() < density / 100) {
        cell.classList.remove("deadCell");
        cell.classList.add("livingCell");
      }
    }
  }
};

const set = () => {
  let widthValue = document.getElementById("width").value;
  let heightValue = document.getElementById("height").value;
  let birthValue = document.getElementById("birth").value.trim();
  let survivalValue = document.getElementById("survival").value.trim();
  let rule = document.getElementById("rule");
  let gridSize = document.getElementById("gridSize");
  let colorInput = document.getElementById("cellColor");
  let speedValue = document.getElementById("speed").value.trim();
  let squareSizeValue = document.getElementById("squareSize").value;
  let densityValue = document.getElementById("density").value;

  ageVisualization = document.getElementById("ageVisualization").checked;
  deathVisualization = document.getElementById("deathVisualization").checked;
  toroidalGrid = document.getElementById("toroidalGridMode").checked;
  cellVisualization = document.getElementById("idVisualization").checked;

  if (!ageVisualization) {
    ageArray = [];
    cells.forEach((cell) => cell.classList.remove(...stageClasses));
  }
  if (!deathVisualization) {
    deathArray = [];
    cells.forEach((cell) => cell.classList.remove(...corpseClasses));
  }
  if (!cellVisualization) {
    cells.forEach(
      (cell) => (cell.querySelector("p").style.visibility = "hidden"),
    );
  }
  if (cellVisualization) {
    cells.forEach(
      (cell) => (cell.querySelector("p").style.visibility = "visible"),
    );
  }

  if (Number(speedValue) <= 0) {
    speedValue = 0.01;
  }
  speed = speedValue;
  document.getElementById("speed").value = speed;

  if (!ageVisualization) {
    document.documentElement.style.setProperty(
      "--living-color",
      colorInput.value,
    );
  } else {
    document.documentElement.style.setProperty("--living-color", "#fff8ec");
  }

  density = Number(densityValue);
  squareSize = Number(squareSizeValue);

  let dimensionsChanged =
    widthValue !== appliedSettings.width ||
    heightValue !== appliedSettings.height;

  width = Number(widthValue);
  height = Number(heightValue);

  birth = birthValue
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "")
    .map(Number);

  survival = survivalValue
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v !== "")
    .map(Number);

  gridSize.innerHTML = `${width}x${height}`;
  rule.innerHTML = `B${birth.join("")}/S${survival.join("")}`;

  appliedSettings = {
    width: widthValue,
    height: heightValue,
    birth: birthValue,
    survival: survivalValue,
    speed: speedValue,
    density: densityValue,
    squareSize: squareSizeValue,
    cellColor: colorInput.value,
    ageVisualization,
    deathVisualization,
    cellVisualization,
    toroidalGrid,
  };

  hideSaved();

  if (gridCreated == true && dimensionsChanged) {
    createGrid();
  }
};

const createGrid = () => {
  buildGrid(width, height);
};

const cancelSettings = () => {
  document.getElementById("width").value = appliedSettings.width;
  document.getElementById("height").value = appliedSettings.height;
  document.getElementById("birth").value = appliedSettings.birth;
  document.getElementById("survival").value = appliedSettings.survival;
  document.getElementById("speed").value = appliedSettings.speed;
  document.getElementById("density").value = appliedSettings.density;
  document.getElementById("squareSize").value = appliedSettings.squareSize;
  document.getElementById("cellColor").value = appliedSettings.cellColor;
  document.getElementById("ageVisualization").checked =
    appliedSettings.ageVisualization;
  document.getElementById("idVisualization").checked =
    appliedSettings.cellVisualization;
  document.getElementById("deathVisualization").checked =
    appliedSettings.deathVisualization;
  document.getElementById("toroidalGridMode").checked =
    appliedSettings.toroidalGrid;

  document.getElementById("gridSize").innerHTML = `${width}x${height}`;
  document.getElementById("rule").innerHTML =
    `B${birth.join("  ")}/S${survival.join("")}`;

  hideSaved();
};

const setRulestring = async (b, s) => {
  let birthValue = (document.getElementById("birth").value = b);
  let survivalValue = (document.getElementById("survival").value = s);
  showCatalog();
  showSaved();
};

const resetSettings = () => {
  pause = true;
  pauseCheck();

  let widthInput = document.getElementById("width");
  let heightInput = document.getElementById("height");
  let birthInput = document.getElementById("birth");
  let survivalInput = document.getElementById("survival");
  let speedInput = document.getElementById("speed");
  let rule = document.getElementById("rule");
  let gridSize = document.getElementById("gridSize");
  let colorInput = document.getElementById("cellColor");
  let ageValue = document.getElementById("ageVisualization");
  let deathValue = document.getElementById("deathVisualization");
  let toroidalValue = document.getElementById("toroidalGridMode");
  let cellIdValue = document.getElementById("idVisualization");
  let squareSizeInput = document.getElementById("squareSize");
  let densityInput = document.getElementById("density");

  ageValue.checked = true;
  deathValue.checked = true;
  toroidalValue.checked = true;
  cellIdValue.checked = true;
  speedInput.value = "0.2";
  densityInput.value = "50";
  squareSizeInput.value = "15";
  colorInput.value = "#fff8ec";
  widthInput.value = "25";
  heightInput.value = "25";
  birthInput.value = "3";
  survivalInput.value = "2,3";
  gridSize.innerHTML = `25x25`;
  rule.innerHTML = `B3/S23`;

  checkUnsavedChanges();
};

const mainFunction = (id) => {
  let right = id + 1;
  let left = id - 1;
  let bottom = id + width;
  let bottomRight = id + width + 1;
  let bottomLeft = id + width - 1;
  let top = id - width;
  let topRight = id - width + 1;
  let topLeft = id - width - 1;

  if (toroidalGrid == true) {
    for (let i = 0; i < height; i++) {
      if (id == width * i) {
        left = id + width - 1;
      }
    }

    for (let i = 0; i < height; i++) {
      if (id == width * i + (width - 1)) {
        right = id - width + 1;
      }
    }

    for (let i = 0; i < width; i++) {
      if (id == i) {
        top = id + width * (height - 1);
      }
    }

    for (let i = 0; i < width; i++) {
      if (id == width * (height - 1) + i) {
        bottom = i;
      }
    }

    for (let i = 0; i < height; i++) {
      if (id == width * i) {
        topLeft = top + width - 1;
        bottomLeft = bottom + width - 1;
      }
    }

    for (let i = 0; i < height; i++) {
      if (id == width * i + (width - 1)) {
        topRight = top - width + 1;
        bottomRight = bottom - width + 1;
      }
    }
  } else {
    for (let i = 0; i < height; i++) {
      if (id == width * i) {
        left = -999;
        topLeft = -999;
        bottomLeft = -999;
      }
    }
    for (let i = 0; i < width; i++) {
      if (id == 1 * i) {
        top = -999;
        topRight = -999;
        topLeft = -999;
      }
    }
    for (let i = 0; i < height; i++) {
      if (id == width * i + (width - 1)) {
        right = -999;
        topRight = -999;
        bottomRight = -999;
      }
    }
    for (let i = 0; i < width; i++) {
      if (id == width * height - 1 - i) {
        bottom = -999;
        bottomRight = -999;
        bottomLeft = -999;
      }
    }
  }

  let cell = cells[id];

  let neighbors = [
    right,
    left,
    bottom,
    bottomRight,
    bottomLeft,
    top,
    topRight,
    topLeft,
  ];

  let count = 0;

  for (let n of neighbors) {
    let c = cells[n];
    if (c?.classList.contains("livingCell")) count++;
  }

  let isAlive = cell.classList.contains("livingCell");

  nextStates[id] =
    (isAlive && survival.includes(count)) ||
    (!isAlive && birth.includes(count));
};

function getAgeById(id) {
  let a = ageArray.find((it) => it.id === id);
  return a;
}

function updateAgeById(id, age) {
  let it = ageArray.find((obj) => obj.id === id);

  if (it) {
    it.age = age;
    return true;
  }
  return false;
}

const applyAge = () => {
  for (let i = 0; i < grid.children.length; i++) {
    let alive = nextStates[i];
    let cell = cells[i];

    if (alive) {
      let existingAge = getAgeById(i);

      if (existingAge) {
        let newAge = existingAge.age + 1;
        updateAgeById(i, newAge);
        cell.classList.remove(...stageClasses);
        cell.classList.add(getStageClass(newAge));
      } else {
        ageArray.push({ id: i, age: 0 });
        cell.classList.remove(...stageClasses);
      }
    } else {
      let idx = ageArray.findIndex((it) => it.id === i);
      if (idx !== -1) ageArray.splice(idx, 1);
      cell.classList.remove(...stageClasses);
    }
  }
};

function getDeathById(id) {
  let d = deathArray.find((it) => it.id === id);
  return d;
}

function updateDeathById(id, deaths) {
  let it = deathArray.find((obj) => obj.id === id);
  if (it) {
    it.deaths = deaths;
    return true;
  }
  return false;
}

const applyDeath = () => {
  for (let i = 0; i < grid.children.length; i++) {
    let alive = nextStates[i];
    let cell = cells[i];

    if (!alive) {
      let wasAlive = cell.classList.contains("livingCell");
      let existingDeath = getDeathById(i);

      if (wasAlive) {
        let newDeaths = existingDeath ? existingDeath.deaths + 1 : 1;

        if (existingDeath) {
          updateDeathById(i, newDeaths);
        } else {
          deathArray.push({ id: i, deaths: newDeaths });
        }

        cell.classList.remove(...corpseClasses);
        cell.classList.add(getCorpseClass(newDeaths));
      } else if (existingDeath) {
        cell.classList.remove(...corpseClasses);
        cell.classList.add(getCorpseClass(existingDeath.deaths));
      }
    } else {
      cell.classList.remove(...corpseClasses);
    }
  }
};

let populationValue = 0;

const counter = () => {
  for (let i = 0; i < grid.children.length; i++) {
    let alive = nextStates[i];
    let wasAlive = cells[i].classList.contains("livingCell");

    if (wasAlive && !alive) {
      deaths++;
    }
    if (!wasAlive && alive) {
      births++;
    }
  }

  populationValue = 0;
  for (let i = 0; i < grid.children.length; i++) {
    let alive = nextStates[i];
    if (alive) {
      populationValue++;
    }
  }
};

const applyStates = () => {
  counter();

  if (deathVisualization == true) {
    applyDeath();
  }

  for (let i = 0; i < grid.children.length; i++) {
    let cell = cells[i];
    let alive = nextStates[i];

    cell.classList.toggle("livingCell", alive);
    cell.classList.toggle("deadCell", !alive);
  }

  if (ageVisualization == true) {
    applyAge();
  }
};

const run = async () => {
  while (true) {
    if (!pause) {
      for (let i = 0; i < grid.children.length; i++) {
        mainFunction(i);
      }

      applyStates();

      const state = getGridState();

      let foundCycle = false;
      for (let cycle = 1; cycle <= maxHistory; cycle++) {
        if (
          history.length >= cycle &&
          state === history[history.length - cycle]
        ) {
          foundCycle = true;
          break;
        }
      }

      if (foundCycle) {
        countGeneration = false;
        showEstWarning();
      } else {
        history.push(state);

        if (history.length > maxHistory) {
          history.shift();
        }

        if (countGeneration) {
          gen++;
          document.getElementById("deaths").innerHTML = `deaths = [${deaths}]`;
          document.getElementById("births").innerHTML = `births = [${births}]`;
          document.getElementById("gen").innerHTML = `gen = [${gen}]`;
          document.getElementById("population").innerHTML =
            `population = [${populationValue}]`;
        }
      }
    }

    await sleep(speed * 1000);
  }
};

let a = false;
const showCatalog = () => {
  closeInfo();
  let catalog = document.getElementById("catalog");

  if (a == false) {
    catalog.style.visibility = "hidden";
    catalog.style.display = "none";
    a = true;
  }

  if (catalog.style.visibility == "hidden") {
    catalog.style.visibility = "visible";
    catalog.style.display = "block ";
  } else {
    catalog.style.visibility = "hidden";
    catalog.style.display = "none";
  }
};

let b = false;
const showInfo = () => {
  closeCatalog();
  let info = document.getElementById("info");

  if (b == false) {
    info.style.visibility = "hidden";
    info.style.display = "none";
    b = true;
  }

  if (info.style.visibility == "hidden") {
    info.style.visibility = "visible";
    info.style.display = "block ";
  } else {
    info.style.visibility = "hidden";
    info.style.display = "none";
  }
};

closeCatalog = () => {
  let catalog = document.getElementById("catalog");

  catalog.style.visibility = "hidden";
  catalog.style.display = "none";
};

closeInfo = () => {
  let info = document.getElementById("info");

  info.style.visibility = "hidden";
  info.style.display = "none";
};

const showEstWarning = () => {
  const simEst = document.getElementById("simEstContainer");
  simEst.style.visibility = "visible";
  simEst.style.display = "block";
};

const hideEstWarning = () => {
  const simEst = document.getElementById("simEstContainer");
  simEst.style.visibility = "hidden";
  simEst.style.display = "none";
};

const showSaved = () => {
  const simEst = document.getElementById("saveWarning");
  simEst.style.visibility = "visible";
  simEst.style.display = "block";
};

const hideSaved = () => {
  const simEst = document.getElementById("saveWarning");
  simEst.style.visibility = "hidden";
  simEst.style.display = "none";
};

const pauseToggle = () => {
  let pauseButton = document.getElementById("play");
  if (pause == true) {
    pause = false;
  } else {
    pause = true;
  }
  pauseCheck();
};

const pauseCheck = () => {
  let pauseButton = document.getElementById("play");
  if (pause == false) {
    pauseButton.innerHTML = "Pause ⏸️";
  } else if (pause == true) {
    pauseButton.innerHTML = "Play ▶️";
  }
};

const step = async () => {
  for (let i = 0; i < grid.children.length; i++) {
    mainFunction(i);
  }

  applyStates();

  const state = getGridState();

  let foundCycle = false;
  for (let cycle = 1; cycle <= maxHistory; cycle++) {
    if (history.length >= cycle && state === history[history.length - cycle]) {
      foundCycle = true;
      break;
    }
  }

  if (foundCycle) {
    countGeneration = false;
    showEstWarning();
  } else {
    history.push(state);

    if (history.length > maxHistory) {
      history.shift();
    }

    if (countGeneration) {
      gen++;
      document.getElementById("deaths").innerHTML = `deaths = [${deaths}]`;
      document.getElementById("births").innerHTML = `births = [${births}]`;
      document.getElementById("gen").innerHTML = `gen = [${gen}]`;
      document.getElementById("population").innerHTML =
        `population = [${populationValue}]`;
    }
  }
};

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", checkUnsavedChanges);
  input.addEventListener("change", checkUnsavedChanges);
});

run();
