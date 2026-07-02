let grid = document.getElementById("grid");
let birth = [3];
let survival = [2, 3];
let pause = true;
let gen = 0;
let width = 10;
let height = 10;
let nextStates = [];
let speed = 0.2;
let ageArray = [];
let deathArray = [];
let ageVisualization = true;
let deathVisualization = true;
let history = [];
let maxHistory = 20;
let countGeneration = true;
let density = 50;
let squareSize = 10;
let maxCellSize = 15;
let minCellSize = 2;
let cells = [];
let toroidalGrid = true;

document.addEventListener("mousedown", () => {
  mouseDown = true;
});

document.addEventListener("mouseup", () => {
  mouseDown = false;
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getGridState = () => {
  let state = "";

  for (let i = 0; i < grid.children.length; i++) {
    state += document.getElementById(i).classList.contains("livingCell")
      ? "1"
      : "0";
  }

  return state;
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

const calculateCellSize = (cols, rows) => {
  const container = document.getElementById("content") || document.body;
  const availableWidth = container.clientWidth - 20;
  const availableHeight = container.clientHeight - 20;

  const sizeByWidth = availableWidth / cols;
  const sizeByHeight = availableHeight / rows;

  let size = Math.min(maxCellSize, sizeByWidth, sizeByHeight);
  size = Math.max(minCellSize, size);

  return size;
};

const applyCellSize = () => {
  const cellSize = calculateCellSize(width, height);
  grid.style.setProperty("--cell-size", `${cellSize}px`);
};

const buildGrid = (width, height) => {
  countGeneration = true;
  gen = 0;
  history.length = 0;
  ageArray = [];
  deathArray = [];
  grid.innerHTML = "";

  grid.style.gridTemplateColumns = `repeat(${width}, var(--cell-size))`;
  grid.style.gridAutoRows = "var(--cell-size)";
  grid.style.border = "2px solid #020018";

  applyCellSize();

  let html = "";

  for (let i = 0; i < width * height; i++) {
    html += `
<div
    id="${i}"
    class="deadCell"
    onmousedown="startPaint(${i})"
    onmouseenter="dragPaint(${i})">
</div>`;
  }

  grid.innerHTML = html;

  cells = [...grid.children];
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
  set();
  let startId =
    Math.floor(height / 2 - squareSize / 2) * width +
    Math.floor(width / 2 - squareSize / 2);
  for (let row = 0; row < squareSize; row++) {
    for (let col = 0; col < squareSize; col++) {
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
  pause = true;
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

  countGeneration = true;
  gen = 0;
  history.length = 0;

  ageVisualization = document.getElementById("ageVisualization").checked;
  deathVisualization = document.getElementById("deathVisualization").checked;
  toroidalGrid = document.getElementById("toroidalGridMode").checked;

  speed = Number(speedValue);

  document.documentElement.style.setProperty(
    "--living-color",
    colorInput.value,
  );

  density = Number(densityValue);
  squareSize = Number(squareSizeValue);

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

  buildGrid(width, height);
};

const setRulestring = (b, s) => {
  pause = true;

  let birthValue = (document.getElementById("birth").value = b);
  let survivalValue = (document.getElementById("survival").value = s);

  let rule = document.getElementById("rule");

  countGeneration = true;
  gen = 0;
  history.length = 0;

  rule.innerHTML = `B${birth.join("")}/S${survival.join("")}`;
};

const reset = () => {
  pause = true;
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
  let squareSizeValue = document.getElementById("squareSize").value;
  let densityValue = document.getElementById("density").value;

  countGeneration = true;
  gen = 0;
  history.length = 0;

  ageValue.checked = true;
  deathValue.checked = true;
  toroidalValue.checked = true;
  ageVisualization = true;
  deathVisualization = true;
  toroidalGrid = true;

  speed = 0.2;
  speedInput.value = speed;

  densityValue = 50;
  squareSizeValue = 10;

  density = 50;
  squareSize = 10;

  colorInput.value = "#fff8ec";
  document.documentElement.style.setProperty(
    "--living-color",
    colorInput.value,
  );

  width = 10;
  height = 10;
  widthInput.value = width;
  heightInput.value = height;

  birth = [3];
  survival = [2, 3];
  birthInput.value = birth.join(",");
  survivalInput.value = survival.join(",");

  gridSize.innerHTML = `${width}x${height}`;
  rule.innerHTML = `B${birth.join("")}/S${survival.join("")}`;
  grid.innerHTML = "";
  buildGrid(width, height);
};

const mainFunction = (id) => {
  let right;
  let left;
  let bottom;
  let bottomRight;
  let bottomLeft;
  let top;
  let topRight;
  let topLeft;

  if (toroidalGrid == true) {
    right = id + 1;
    left = id - 1;
    bottom = id + width;
    top = id - width;

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

    topLeft = top - 1;
    topRight = top + 1;
    bottomLeft = bottom - 1;
    bottomRight = bottom + 1;

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
    right = id + 1;
    left = id - 1;
    bottom = id + width;
    bottomRight = id + width + 1;
    bottomLeft = id + width - 1;
    top = id - width;
    topRight = id - width + 1;
    topLeft = id - width - 1;
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
    let c = document.getElementById(n);
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
      let wasAlive = getAgeById(i);
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

const applyStates = () => {
  for (let i = 0; i < grid.children.length; i++) {
    let cell = cells[i];
    let alive = nextStates[i];

    cell.classList.toggle("livingCell", alive);
    cell.classList.toggle("deadCell", !alive);
  }

  if (deathVisualization == true) {
    applyDeath();
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

      if (history.includes(state)) {
        countGeneration = false;
      } else {
        history.push(state);

        if (history.length > maxHistory) {
          history.shift();
        }

        if (countGeneration) {
          gen++;
          document.getElementById("gen").innerHTML = `gen = [${gen}]`;
        }
      }
    }

    await sleep(speed * 1000);
  }
};

let a = false;
const showCatalog = () => {
  let catalog = document.getElementById("catalog");

  if (a == false) {
    catalog.style.visibility = "hidden";
    a = true;
  }

  if (catalog.style.visibility == "hidden") {
    catalog.style.visibility = "visible";
  } else {
    catalog.style.visibility = "hidden";
  }
};

const pauseToggle = () => {
  let pauseButton = document.getElementById("play");
  if (pause == true) {
    pause = false;
    pauseButton.innerHTML = "Pause";
  } else {
    pause = true;
    pauseButton.innerHTML = "Play";
  }
};

run();
