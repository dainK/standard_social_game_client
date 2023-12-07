import player from"./player";
import { Bodies, Body, Engine, Events, Render, Runner, World } from "matter-js";

export default {
  name: "Rank",
  data() {
    return {};
  },
  mounted() {
    this.initialize();
  },
  methods: {
    initialize() {
      const engine = Engine.create();
      const render = Render.create({
        engine,
        element: document.body,
        options: {
          wireframes: false,
          background: "#F7F4C8",
          width: 620,
          height: 850,
        },
      });
      const world = engine.world;

      const myRank = Bodies.rectangle(310, 400, 620, 50, {
        name: "topLine",
        isStatic: true,
        isSensor: true,
        render: { fillStyle: "#E6B143" },
      });

      World.add(world, [myRank]);
      Render.run(render);
      Runner.run(engine);

      function createImage(text){
        let drawing = document.createElement("canvas");
    
        drawing.width = '300'
        drawing.height = '150'
        let ctx = drawing.getContext("2d");
        ctx.fillStyle = "#000";
        ctx.font = "20pt sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(text, 85, 75);
        return drawing.toDataURL("image/png");
      }

      // function gameOver() {
        fetch("http://localhost:3017/api/ranking")
        .then((response) => response.json())
            .then((response) => {
                console.log(response);
                const newIndex = response.data.findIndex(item => item.rankId === player.currScore.rankId);
                // player.currScore = response.data;
                // console.log(player.currScore);
                console.log(response.data[newIndex]);
                for(let i = -5; i<6; i++) {
                  if( newIndex+i > -1 && newIndex+i < response.data.length) {
                    createRankingOne(response.data[newIndex+i].rank,response.data[newIndex].name,response.data[newIndex].score,i);
                  }
                }
                
              })
              .catch((error) => console.error("에러 발생:", error));
      // }


      function createRankingOne(rank,name,score,index) {
        const ranktext = Bodies.rectangle(200, 410+index*50, 500,100, {
          isSleeping: true,
          isSensor:true,
          render: {
            sprite: {texture: createImage(`${rank}`)}
          }
        });
        const nametext = Bodies.rectangle(300, 410+index*50, 500,100, {
          isSleeping: true,
          isSensor:true,
          render: {
            sprite: {texture: createImage(`${name}`)}
          }
        });
        const scoretext = Bodies.rectangle(500, 410+index*50, 500,100, {
          isSleeping: true,
          isSensor:true,
          render: {
            sprite: {texture: createImage(`${score}`)}
          }
        });
        World.add(world, [ranktext,nametext,scoretext]);
      }
      

    }
  },
};
