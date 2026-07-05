const stageClasses = [
  "stage1",
  "stage2",
  "stage3",
  "stage4",
  "stage5",
  "stage6",
  "stage7",
  "stage8",
  "stage9",
  "stage10",
  "stage11",
  "stage12",
  "stage13",
  "stage14",
  "stage15",
  "stage16",
  "stage17",
  "stage18",
  "stage19",
  "stage20",
  "stage21",
  "stage22",
  "stage23",
  "stage24",
  "stage25",
  "stage26",
  "stage27",
  "stage28",
  "stage29",
  "stage30",
];

const stageThresholds = [
  0, 1, 3, 6, 9, 14, 19, 26, 33, 42, 52, 64, 78, 94, 111, 131, 152, 175, 200,
  227, 258, 292, 330, 372, 417, 466, 519, 576, 636, 700,
];

const getStageClass = (age) => {
  for (let i = stageThresholds.length - 1; i >= 0; i--) {
    if (age >= stageThresholds[i]) {
      return stageClasses[i];
    }
  }
  return stageClasses[0];
};

const corpseClasses = [
  "corpse1",
  "corpse2",
  "corpse3",
  "corpse4",
  "corpse5",
  "corpse6",
  "corpse7",
  "corpse8",
  "corpse9",
  "corpse10",
  "corpse11",
  "corpse12",
  "corpse13",
  "corpse14",
  "corpse15"
];

const corpseThresholds = [
  0, 1, 2, 4, 6, 8, 10, 13, 16, 19, 22, 26, 30, 35, 40
];

const getCorpseClass = (deaths) => {
  for (let i = corpseThresholds.length - 1; i >= 0; i--) {
    if (deaths >= corpseThresholds[i]) {
      return corpseClasses[i];
    }
  }
  return corpseClasses[0];
};
