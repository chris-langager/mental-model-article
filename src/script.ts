import Matter from "matter-js";

// module aliases
var Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Body = Matter.Body;

// create an engine
var engine = Engine.create();

const width = 600;
const height = 1200;

// create a renderer
var render = Render.create({
  element: document.getElementById("world"),
  engine: engine,
  options: {
    width,
    height,
    background: "#fff",
    wireframes: false,
  },
});

Render.run(render);

// -- bumpers --
const bumperOffset = 10;
const leftBumper = Bodies.rectangle(0 + bumperOffset, 0, 1, height * 2, {
  isStatic: true,
});

const rightBumper = Bodies.rectangle(width - bumperOffset, 0, 1, height * 2, {
  isStatic: true,
});

World.add(engine.world, [leftBumper, rightBumper]);

// -- controls --
const generatedControls = [];
const offset = 50;
let x = offset;
let y = 150;
const xSpacing = 180;
const ySpacing = 80;
const jitter = 80;
const spaceProbablility = 0.1;
for (let i = 0; i < 50; i++) {
  x += xSpacing + getRandomInt(0, jitter);
  if (x > width - offset) {
    x = offset + getRandomInt(0, jitter);
    y += ySpacing + getRandomInt(0, jitter);
  }

  if (Math.random() < spaceProbablility) continue;

  let type: ControlType = "if";
  const typeRandom = Math.random();
  if (typeRandom < 0.333) {
    type = "while";
  }
  if (typeRandom > 0.666) {
    type = "for";
  }
  const control = createControl({
    type,
    x,
    y,
  });

  generatedControls.push(control);
}

World.add(engine.world, generatedControls);

// -- variables --

World.add(engine.world, getRandomVariable());
setInterval(() => {
  World.add(engine.world, getRandomVariable());
}, 500);

// run the engine
Engine.run(engine);

// -- helper functions --

function createVariable(name: "var" | "{}") {
  const sprite =
    name === "{}"
      ? {
          texture: "https://i.ibb.co/NCk8gRx/circle-cropped-1.png",
          xScale: 0.45,
          yScale: 0.45,
        }
      : {
          texture: "https://i.ibb.co/3RjY743/circle-cropped.png",
          xScale: 0.3,
          yScale: 0.3,
        };

  return Bodies.circle(300, 0, 30, {
    mass: 30,
    restitution: 1,
    render: {
      lineWidth: 5,
      strokeStyle: "#000",
      sprite,
    },
  });
}

function getRandomVariable() {
  const kind = Math.random() > 0.5 ? "{}" : "var";
  return createVariable(kind);
}

type ControlType = "if" | "while" | "for";
interface CreateControlOptions {
  type: ControlType;
  x: number;
  y: number;
}

function createControl(opts: CreateControlOptions) {
  const { type, x, y } = opts;

  const typeToWidth: { [K in ControlType]: number } = {
    if: 40,
    for: 50,
    while: 80,
  };

  const width = typeToWidth[type] || 40;
  const height = 40;

  const body = Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    render: {
      sprite: {
        texture: createRectangleImage(type, width, height),
        xScale: 1,
        yScale: 1,
      },
    },
  });

  Body.rotate(body, Math.random() > 0.5 ? 45 : -45);
  return body;
}

function createRectangleImage(text: string, width: number, height: number) {
  let canvas = document.createElement("canvas");

  canvas.style.backgroundColor = "#e5e5e5";
  canvas.width = width;
  canvas.height = height;

  let ctx = canvas.getContext("2d");

  ctx.fillStyle = "black";

  //border
  ctx.lineWidth = 6;
  ctx.strokeRect(0, 0, width, height);

  //text
  ctx.font = "12pt sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(text, width / 2, height / 2 + 5);

  return canvas.toDataURL("image/png");
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
