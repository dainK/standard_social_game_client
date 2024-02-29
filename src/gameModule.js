import { Bodies, Engine, Events, Render, World } from "matter-js";

const createGame = () => {
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

  const renderCanvas = render.canvas;
  World.remove(engine.world, render);
  renderCanvas.parentNode.removeChild(renderCanvas);

  World.clear(world, false);
  Engine.clear(engine);
  Events.off(engine);

  return { engine, render, world };
};

export { createGame };