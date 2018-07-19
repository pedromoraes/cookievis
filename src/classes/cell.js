class Cell {
  constructor(app, domain, cookies, size) {
    this.domain = domain;
    this.cookies = cookies;
    this.size = size;
    this.color = _.sample(palette);
    this.xSpeed = (-0.5 + Math.random()) * 0.5;
    this.ySpeed = (-0.5 + Math.random()) * 0.5;
    this.render(app);
    this.ctnr.x = this.size + Math.random() * (app.w - this.size);
    this.ctnr.y = this.size + Math.random() * (app.h - this.size);
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

  render(app) {
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
    app.pixi.stage.addChild(this.ctnr);
  }

  update(w, h) {
    this.ctnr.x += this.xSpeed;
    this.ctnr.y += this.ySpeed;
    if (this.ctnr.x + this.size > w) {
      this.ctnr.x = w - this.size;
      this.xSpeed *= -1;
    } else if (this.ctnr.x - this.size < 0) {
      this.ctnr.x = this.size;
      this.xSpeed *= -1;
    }
    if (this.ctnr.y + this.size > h) {
      this.ctnr.y = h - this.size;
      this.ySpeed *= -1;
    } else if (this.ctnr.y - this.size < 0) {
      this.ctnr.y = this.size;
      this.ySpeed *= -1;
    }
  }
}
