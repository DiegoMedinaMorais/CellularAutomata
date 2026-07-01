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
let ageVisualization = true;
let history = [];
let maxHistory = 20;
let countGeneration = true;
let density = 50;
let squareSize = 10;

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
  let cell = document.getElementById(id);

  paintAlive = cell.classList.contains("deadCell");

  toggleLiving(id, paintAlive);
};

const dragPaint = (id) => {
  if (!mouseDown) return;

  toggleLiving(id, paintAlive);
};

const buildGrid = (width, height) => {
  countGeneration = true;
  gen = 0;
  history.length = 0;
  ageArray = [];
  grid.innerHTML = "";

  grid.style.gridTemplateColumns = `repeat(${width}, 15px)`;
  grid.style.gridAutoRows = "15px";
  grid.style.border = "2px solid #020018";

  let html = "";

  for (let i = 0; i < width * height; i++) {
    html += `
<div
    id="${i}"
    class="deadCell"
    onmousedown="startPaint(${i})"
    onmouseenter="dragPaint(${i})"
    style="width:15px;height:15px;">
</div>`;
  }

  grid.innerHTML = html;
};

const toggleLiving = (id, state = null) => {
  let cell = document.getElementById(id);

  let makeAlive = state === null ? cell.classList.contains("deadCell") : state;

  if (makeAlive) {
    cell.classList.remove("deadCell");
    cell.classList.add("livingCell");
  } else {
    cell.classList.remove("livingCell");
    cell.classList.add("deadCell");
    cell.classList.remove(...stageClasses);

    let idx = ageArray.findIndex((it) => it.id === id);
    if (idx !== -1) ageArray.splice(idx, 1);
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
  let squareSizeValue = document.getElementById("squareSize").value;
  let densityValue = document.getElementById("density").value;

  countGeneration = true;
  gen = 0;
  history.length = 0;

  ageValue.checked = true;
  ageVisualization = true;

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
  let right = id + 1;
  let left = id - 1;
  let bottom = id + width;
  let bottomRight = id + width + 1;
  let bottomLeft = id + width - 1;
  let top = id - width;
  let topRight = id - width + 1;
  let topLeft = id - width - 1;

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

  let cell = document.getElementById(id);

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
    let cell = document.getElementById(i);
 
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
}

const applyStates = () => {
  for (let i = 0; i < grid.children.length; i++) {
    let cell = document.getElementById(i);
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
