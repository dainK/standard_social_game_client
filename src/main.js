import {
  Bodies,
  Body,
  Engine,
  Events,
  Render,
  Runner,
  World,
  Mouse,
  MouseConstraint,
} from 'matter-js';
import { FRUITS_BASE, FRUITS_HLW } from './fruits';
import './style/dark.css';
import { player } from './player.js';
import { createGame } from './gameModule.js';

// 게임 초기화
let { engine, render, world } = createGame();

let THEME = 'halloween'; // { base, halloween }
let FRUITS = FRUITS_BASE;
let SCORE = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66];

// let localData = [];
// // 배열을 로컬 스토리지에 저장하는 함수
// function saveArrayToLocalStorage(key, array) {
//   // 배열을 JSON 문자열로 변환하여 저장
//   localStorage.setItem(key, JSON.stringify(array));
// }
// if (getArrayFromLocalStorage('myLocalData')) {
//   localData = getArrayFromLocalStorage('myLocalData');
// }

// 로컬 스토리지에서 배열을 읽어오는 함수
function getArrayFromLocalStorage(key) {
  // JSON 문자열을 읽어와서 배열로 변환하여 반환
  const jsonString = localStorage.getItem(key);
  return jsonString ? JSON.parse(jsonString) : [];
}

const replayText = Bodies.rectangle(100, 100, 500, 100, {
  isSleeping: true,
  isSensor: true,
  isStatic: true,
  render: {
    sprite: { texture: createImage(`Replay : R`) },
  },
});

switch (THEME) {
  case 'halloween':
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
    background: '#F7F4C8',
    width: 620,
    height: 850,
  },
});

world = engine.world;

const leftWall = Bodies.rectangle(15, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

const rightWall = Bodies.rectangle(605, 395, 30, 790, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

const ground = Bodies.rectangle(310, 820, 620, 60, {
  isStatic: true,
  render: { fillStyle: '#E6B143' },
});

const topLine = Bodies.rectangle(310, 150, 620, 2, {
  name: 'topLine',
  isStatic: true,
  isSensor: true,
  render: { fillStyle: '#E6B143' },
});

World.add(world, [leftWall, rightWall, ground, topLine, replayText]);

Render.run(render);
Runner.run(engine);

let currentBody = null;
let currentFruit = null;
let disableAction = false;
let interval = null;

// let elapsedTime = 0;
// let countdown = 60;

// let timerInterval = setInterval(() => {
//   // elapsedTime += 1;
//   // updateTimer();

//   // if (elapsedTime >= countdown) {
//   //   stopTimer();
//   // }
//   clearInterval(timerInterval);
//   gameOver();
// }, 1000);

// let timer = null;
let score = null;
let scoreIndex = 0;
// let self = this;
function gameOver() {
  disableAction = true;
  let nickname = 'NO NAME';
  nickname = prompt('닉네임을 입력하세요:', 'NO NAME');
  // localData.push({ name: nickname, score: scoreIndex });

  fetch(`${import.meta.env.VITE_API}/api/ranking/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 다른 필요한 헤더가 있다면 여기에 추가
    },
    body: JSON.stringify({
      name: nickname,
      score: scoreIndex,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      // player.currScore = response.data;
      console.log(response);

      const renderCanvas = render.canvas;
      World.remove(engine.world, render);
      renderCanvas.parentNode.removeChild(renderCanvas);

      World.clear(world, false);
      Engine.clear(engine);
      Events.off(engine);

      const replayText2 = Bodies.rectangle(100, 100, 500, 100, {
        isSleeping: true,
        isSensor: true,
        isStatic: true,
        render: {
          sprite: { texture: createImage(`Replay : R`) },
        },
      });

      const ranking = Bodies.rectangle(300, 30, 500, 100, {
        isSleeping: true,
        isSensor: true,
        isStatic: true,
        render: {
          sprite: { texture: createImage(`Ranking`) },
        },
      });

      const rankingbg = Bodies.rectangle(310, 20, 620, 50, {
        name: 'topLine',
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#E6B143' },
      });

      // self.$router.push("/rank");
      engine = Engine.create();
      render = Render.create({
        engine,
        element: document.body,
        options: {
          wireframes: false,
          background: '#F7F4C8',
          width: 620,
          height: 850,
        },
      });
      world = engine.world;

      const myRank = Bodies.rectangle(310, 400, 620, 50, {
        name: 'topLine',
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#E6B143' },
      });

      World.add(world, [myRank, replayText2, rankingbg, ranking]);
      Render.run(render);
      Runner.run(engine);

      function createRankingOne(rank, name, score, index) {
        const ranktext = Bodies.rectangle(200, 410 + index * 50, 500, 100, {
          isSleeping: true,
          isSensor: true,
          isStatic: true,
          render: {
            sprite: { texture: createImage(`${rank}`) },
          },
        });
        const nametext = Bodies.rectangle(300, 410 + index * 50, 500, 100, {
          isSleeping: true,
          isSensor: true,
          isStatic: true,
          render: {
            sprite: { texture: createImage(`${name}`) },
          },
        });
        const scoretext = Bodies.rectangle(500, 410 + index * 50, 500, 100, {
          isSleeping: true,
          isSensor: true,
          isStatic: true,
          render: {
            sprite: { texture: createImage(`${score}`) },
          },
        });
        World.add(world, [ranktext, nametext, scoretext]);
      }

      const currData = response.playerData; //localData[localData.length - 1];
      const sortRank = response.rankings; //.sort((a, b) => b.score - a.score);
      let newIndex = -1;
      sortRank.forEach((e, index) => {
        if (currData.score === e.score && currData.name === e.name) {
          newIndex = index;
        }
      });
      // console.log(response.data[newIndex]);
      for (let i = -5; i < 6; i++) {
        if (newIndex + i > -1 && newIndex + i < sortRank.length) {
          createRankingOne(
            newIndex + i,
            sortRank[newIndex + i].name,
            sortRank[newIndex + i].score,
            i,
          );
        }
      }
    })
    .catch((error) => console.error('에러 발생:', error));
}

// function gameOver() {
//   // alert(`gameOver! your score ${score}`);
//   // var nickname = prompt('닉네임을 입력하세요:', '');
//   // localData.push({ name: nickname, score: scoreIndex });
//   // saveArrayToLocalStorage('myLocalData', localData);

//   const renderCanvas = render.canvas;
//   World.remove(engine.world, render);
//   renderCanvas.parentNode.removeChild(renderCanvas);

//   World.clear(world, false);
//   Engine.clear(engine);
//   Events.off(engine);

//   const replayText2 = Bodies.rectangle(100, 100, 500, 100, {
//     isSleeping: true,
//     isSensor: true,
//     render: {
//       sprite: { texture: createImage(`Replay : R`) },
//     },
//   });

//   const ranking = Bodies.rectangle(300, 30, 500, 100, {
//     isSleeping: true,
//     isSensor: true,
//     render: {
//       sprite: { texture: createImage(`Ranking`) },
//     },
//   });

//   const rankingbg = Bodies.rectangle(310, 20, 620, 50, {
//     name: 'topLine',
//     isStatic: true,
//     isSensor: true,
//     render: { fillStyle: '#E6B143' },
//   });

//   // self.$router.push("/rank");
//   engine = Engine.create();
//   render = Render.create({
//     engine,
//     element: document.body,
//     options: {
//       wireframes: false,
//       background: '#F7F4C8',
//       width: 620,
//       height: 850,
//     },
//   });
//   world = engine.world;

//   const myRank = Bodies.rectangle(310, 400, 620, 50, {
//     name: 'topLine',
//     isStatic: true,
//     isSensor: true,
//     render: { fillStyle: '#E6B143' },
//   });

//   World.add(world, [myRank, replayText2, rankingbg, ranking]);
//   Render.run(render);
//   Runner.run(engine);

//   function createRankingOne(rank, name, score, index) {
//     const ranktext = Bodies.rectangle(200, 410 + index * 50, 500, 100, {
//       isSleeping: true,
//       isSensor: true,
//       render: {
//         sprite: { texture: createImage(`${rank}`) },
//       },
//     });
//     const nametext = Bodies.rectangle(300, 410 + index * 50, 500, 100, {
//       isSleeping: true,
//       isSensor: true,
//       render: {
//         sprite: { texture: createImage(`${name}`) },
//       },
//     });
//     const scoretext = Bodies.rectangle(500, 410 + index * 50, 500, 100, {
//       isSleeping: true,
//       isSensor: true,
//       render: {
//         sprite: { texture: createImage(`${score}`) },
//       },
//     });
//     World.add(world, [ranktext, nametext, scoretext]);
//   }

//   const currData = localData[localData.length - 1];
//   const sortRank = localData.sort((a, b) => b.score - a.score);
//   let newIndex = -1;
//   sortRank.forEach((e, index) => {
//     if (currData.score === e.score && currData.name === e.name) {
//       newIndex = index;
//     }
//   });
//   // console.log(response.data[newIndex]);
//   for (let i = -5; i < 6; i++) {
//     if (newIndex + i > -1 && newIndex + i < sortRank.length) {
//       createRankingOne(
//         newIndex + i,
//         sortRank[newIndex + i].name,
//         sortRank[newIndex + i].score,
//         i,
//       );
//     }
//   }
// }

// ************************* Text to Image **********************
function createImage(text) {
  let drawing = document.createElement('canvas');

  drawing.width = '300';
  drawing.height = '150';
  let ctx = drawing.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.font = '20pt sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(text, 85, 75);
  return drawing.toDataURL('image/png');
}
// ************************* Timer **********************
// function stopTimer() {
//   clearInterval(timerInterval);
//   // alert("Game over");
//   gameOver();
// }

// function updateTimer() {
//   const remainingTime = countdown - elapsedTime;
//   console.log(remainingTime);
//   if (timer) {
//     World.remove(world, timer);
//   }

//   timer = Bodies.rectangle(100, 100, 500, 100, {
//     isSleeping: true,
//     isSensor: true,
//     render: {
//       sprite: { texture: createImage(`Time: ${remainingTime}s`) },
//     },
//   });

//   World.add(world, timer);
// }
// updateTimer();
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
    isStatic: true,
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
    name: 'fruit',
    index: index,
    isSleeping: true,
    render: {
      sprite: { texture: `${fruit.name}.png` },
    },
    restitution: 0.2,
    // label: 'fruit',
  });

  currentBody = body;
  currentFruit = fruit;

  World.add(world, body);
}
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
});
// 클릭 이벤트 감지
Events.on(mouseConstraint, 'mousedown', (event) => {
  if (disableAction) {
    return;
  }

  // 클릭한 위치로 몸체 이동
  if (
    event.mouse.position.x - currentFruit.radius > 15 &&
    event.mouse.position.x + currentFruit.radius < 605
  ) {
    Body.setPosition(currentBody, {
      x: event.mouse.position.x,
      y: currentBody.position.y,
    });

    currentBody.isSleeping = false;
    disableAction = true;

    setTimeout(() => {
      addFruit();
      disableAction = false;
    }, 1000);
  }
});

window.onkeydown = (event) => {
  if (disableAction) {
    return;
  }

  switch (event.code) {
    case 'KeyA':
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody.position.x - currentFruit.radius > 30)
          Body.setPosition(currentBody, {
            x: currentBody.position.x - 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case 'KeyD':
      if (interval) return;

      interval = setInterval(() => {
        if (currentBody.position.x + currentFruit.radius < 590)
          Body.setPosition(currentBody, {
            x: currentBody.position.x + 1,
            y: currentBody.position.y,
          });
      }, 5);
      break;

    case 'KeyS':
    case 'Space':
      currentBody.isSleeping = false;
      disableAction = true;

      setTimeout(() => {
        addFruit();
        disableAction = false;
      }, 1000);
      break;

    // case 'KeyE':
    //   scoreIndex = 500;
    //   gameOver();
    //   break;
  }
};

window.onkeyup = (event) => {
  switch (event.code) {
    case 'KeyA':
    case 'KeyD':
      clearInterval(interval);
      interval = null;
      break;
    case 'KeyR':
      location.reload();
  }
};

Events.on(engine, 'collisionStart', (event) => {
  event.pairs.forEach((collision) => {
    if (collision.bodyA.name === 'fruit' && collision.bodyB.name === 'fruit') {
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
            name: 'fruit',
            render: {
              sprite: { texture: `${newFruit.name}.png` },
            },
            index: index + 1,
            // label: 'fruit',
          },
        );

        World.add(world, newBody);
      }
    } else if (
      !disableAction &&
      (collision.bodyA.name === 'topLine' || collision.bodyB.name === 'topLine')
    ) {
      // alert("Game over");
      gameOver();
    }
  });
});

addFruit();
