let app, cookieData;
let bounds = { width: window.innerWidth, height: window.innerHeight };;
const cells = [];
const palette = [0x069CF6, 0xFC5F02, 0xF1C917, 0x20E045, 0xF82D04, 0x63419D];

class Cell {
  constructor(domain, cookies) {
    this.domain = domain;
    this.cookies = cookies;
    this.size = 10 + cookies.length * window.innerWidth / cookieData.total;
    this.color = _.sample(palette);
    this.xSpeed = (-0.5 + Math.random()) * 0.5;
    this.ySpeed = (-0.5 + Math.random()) * 0.5;
    this.render();
    this.ctnr.x = this.size + Math.random() * (bounds.width - this.size);
    this.ctnr.y = this.size + Math.random() * (bounds.height - this.size);
  }

  mouseover() {
    const parent = this.ctnr.parent;
    parent.removeChild(this.ctnr);
    parent.addChild(this.ctnr);
    this.hover = true;
    this.text.cacheAsBitmap = false;
    this.text.alpha = 1;
  }

  mouseout() {
    this.hover = false;
    this.text.alpha = 0.5;
    this.text.cacheAsBitmap = true;
  }

  render() {
    this.ctnr = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(this.color, 0.9);
    this.graphics.drawCircle(0, 0, this.size);
    this.graphics.endFill();
    this.graphics.interactive = true;
    this.graphics.hitArea = new PIXI.Circle(0, 0, this.size);
    this.graphics.mouseover = () => this.mouseover();
    this.graphics.mouseout = () => this.mouseout();
    this.ctnr.addChild(this.graphics);
    const fontSize = this.size * 3 / this.domain.length;
    this.text = new PIXI.Text(this.domain, {
      fontFamily : 'Arial', fontSize, fill: 0xffffff, align : 'center'
    });
    this.text.alpha = 0.25;
    this.text.anchor.set(0.5, 0.5);
    this.text.cacheAsBitmap = true;
    this.ctnr.addChild(this.text);
    app.stage.addChild(this.ctnr);
  }

  update() {
    this.ctnr.x += this.xSpeed;
    this.ctnr.y += this.ySpeed;
    if (this.ctnr.x + this.size > bounds.width) {
      this.ctnr.x = bounds.width - this.size;
      this.xSpeed *= -1;
    } else if (this.ctnr.x - this.size < 0) {
      this.ctnr.x = this.size;
      this.xSpeed *= -1;
    }
    if (this.ctnr.y + this.size > bounds.height) {
      this.ctnr.y = bounds.height - this.size;
      this.ySpeed *= -1;
    } else if (this.ctnr.y - this.size < 0) {
      this.ctnr.y = this.size;
      this.ySpeed *= -1;
    }
  }
}

window.addEventListener("resize", function() {
  app.renderer.resize(window.innerWidth, window.innerHeight);
});

function setupVis() {
  app = new PIXI.Application(window.innerWidth, window.innerHeight, {
    backgroundColor: palette.shift(),
    transparent: false,
    antialias: true
  });
  document.body.appendChild(app.view);
  app.ticker.add(update);
}

function update() {
  bounds = { width: window.innerWidth, height: window.innerHeight };
  cells.forEach(c => !c.hover && c.update());
}

document.addEventListener('DOMContentLoaded', () => {
  getData().then((data) => {
    setupVis();
    cookieData = data;
    cookieData.domains.forEach((domain) =>
      cells.push(new Cell(domain, cookieData.consolidated[domain])));
  });
});
