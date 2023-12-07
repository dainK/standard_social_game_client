import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";
import { FRUITS_BASE, FRUITS_HLW } from "./fruits";
import "./style/dark.css";
import {player} from "./player";
import { createGame } from "./gameModule";

// 게임 초기화
let { engine, render, world } = createGame();

let THEME = "halloween"; // { base, halloween }
let FRUITS = FRUITS_BASE;
let SCORE = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66];

switch (THEME) {
  case "halloween":
    FRUITS = FRUITS_HLW;
    break;
  default:
    FRUITS = FRUITS_BASE;
}

engine = Engine.create();
render = Render.create({
  engine,
  element: document.body,
  options: {
    wireframes: false,
    background: "#F7F4C8",
    width: 620,
    height: 850,
  },
});

 world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: "#E6B143" },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: "topLine",
  isStatic: true,
  isSensor: true,
  render: { fillStyle: "#E6B143" },
});

World.add(world, [leftWall, rightWall, ground, topLine]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;

let elapsedTime = 0;
let countdown = 60;

let timerInterval = setInterval(() => {
  elapsedTime += 1;
  updateTimer();

  if (elapsedTime >= countdown) {
    stopTimer();
  }
}, 1000);

let timer = null;
let score = null;
let scoreIndex = 0;
let self = this;
function gameOver() {
  disableAction = true;

  fetch("http://localhost:3017/api/ranking", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 다른 필요한 헤더가 있다면 여기에 추가
    },
    body: JSON.stringify({
      name: "GUEST",
      score: scoreIndex,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      player.currScore = response.data;

      const renderCanvas = render.canvas;
      World.remove(engine.world, render);
      renderCanvas.parentNode.removeChild(renderCanvas);

      World.clear(world, false);
      Engine.clear(engine);
      Events.off(engine);

      self.$router.push("/rank");
    })
    .catch((error) => console.error("에러 발생:", error));
}

// ************************* Text to Image **********************
function createImage(text) {
  let drawing = document.createElement("canvas");

  drawing.width = "300";
  drawing.height = "150";
  let ctx = drawing.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.font = "20pt sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(text, 85, 75);
  return drawing.toDataURL("image/png");
}
// ************************* Timer **********************
function stopTimer() {
  clearInterval(timerInterval);
  // alert("Game over");
  gameOver();
}

function updateTimer() {
  const remainingTime = countdown - elapsedTime;
  console.log(remainingTime);
  if (timer) {
    World.remove(world, timer);
  }

  timer = Bodies.rectangle(100, 100, 500, 100, {
    isSleeping: true,
    isSensor: true,
    render: {
      sprite: { texture: createImage(`Time: ${remainingTime}s`) },
    },
  });

  World.add(world, timer);
}
updateTimer();
// ************************* score **********************
function updateScore(index) {
  //scoreIndex += SCORE[index];
  // console.log(remainingTime);
  if (score) {
    World.remove(world, score);
  }

  score = Bodies.rectangle(500, 100, 500, 100, {
    isSleeping: true,
    isSensor: true,
    render: {
      sprite: { texture: createImage(`Score: ${scoreIndex}`) },
    },
  });

  World.add(world, score);
}
updateScore(0); // 기본 0으로 보여주기
// ***********************************************************

function addFruit() {
  const index = Math.floor(Math.random() * 5);
  const fruit = FRUITS[index];

  const body = Bodies.circle(300, 50, fruit.radius, {
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` },
    },
    restitution: 0.2,
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}

window.onkeydown = (event) => {
  if (disableAction) {
    return;
  }

  switch (event.code) {
    case "KeyA":
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyD":
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590)
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case "KeyS":
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);
      break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case "KeyA":
    case "KeyD":
      clearInterval(interval);
      interval = null;
  }
};

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.index === collision.bodyB.index) {
      const index = collision.bodyA.index;

      if (index === FRUITS.length - 1) {
        return;
      }

      // score update
      scoreIndex += SCORE[index];
      updateScore(scoreIndex);

      World.remove(world, [collision.bodyA, collision.bodyB]);

      const newFruit = FRUITS[index + 1];

      const newBody = Bodies.circle(
        collision.collision.supports[0].x,
        collision.collision.supports[0].y,
        newFruit.radius,
        {
          render: {
            sprite: { texture: `${newFruit.name}.png` },
          },
          index: index + 1,
        }
      );

      World.add(world, newBody);
    }

    if (
      !disableAction &&
      (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")
    ) {
      // alert("Game over");
      gameOver();
    }
  });
});

addFruit();
