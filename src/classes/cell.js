class Cell {
  constructor(domain, cookies, size, caption) {
    this.domain = domain;
    this.cookies = cookies;
    this.size = size || 8 + Math.random() * 20;
    this.caption = caption;
    this.tweens = [];
    if (domain) {
      this.color = _.sample(palette);
      this.xSpeed = (-0.5 + Math.random()) * 5 / size;
      this.ySpeed = (-0.5 + Math.random()) * 5 / size;
    } else {
      this.color = _.sample(disabledPalette);
      this.xSpeed = (-0.5 + Math.random()) / this.size;
      this.ySpeed = (-0.5 + Math.random()) / this.size;
    }
  }

  set enabled(value) {
    this.ctnr.interactive = value;
    this.ctnr.buttonMode = value;
  }

  lock() {
    let ref = {
      scale: this.ctnr.scale.x,
      x: this.ctnr.x,
      y: this.ctnr.y
    };
    const scale = hh / this.size / 2;
    this.tweening = true;
    this.locked = true;
    return this.tween(ref)
      .to({ scale, x: ww/2, y: hh/2 }, 900)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(() => {
        this.ctnr.x = ref.x;
        this.ctnr.y = ref.y;
        this.ctnr.scale.set(ref.scale);
      })
      .onComplete(() => {
        this.tweening = false;
        clearInterval(this.interval);
        this.interval = setInterval(() => {
          if (!this.hover) {
            this.locked = false;
            this.enabled = true;
            this.scaleOut();
            clearInterval(this.interval)
          }
        }, 999);
      })
      .start();
  }

  scaleOut() {
    let ref = { scale: this.ctnr.scale.x };
    this.tweening = true;
    return this.tween(ref)
      .to({ scale: 1 }, 600)
      .easing(TWEEN.Easing.Quadratic.In)
      .onUpdate(() => this.ctnr.scale.set(ref.scale))
      .onComplete(() => this.tweening = false)
      .start();
  }

  explode() {
    clearInterval(this.interval);
    this.tweens.forEach(t => t.stop());
    this.tweening = true;
    this.enabled = false;
    const ref = { scale: this.ctnr.scale.x, alpha: 1 };
    return this.tween(ref)
      .to({ scale: ref.scale * 10, alpha: 0 }, 900)
      .easing(TWEEN.Easing.Quadratic.In)
      .onUpdate(() => {
        this.ctnr.scale.set(ref.scale);
        this.ctnr.alpha = ref.alpha;
      })
      .onComplete(() => {
        this.ctnr.parent.removeChild(this.ctnr);
        for (var s in this) this[s] = null;
      })
      .start();
  }

  click() {
    if (this.locked) {
      app.wipe(this);
      this.explode();
    } else {
      this.lock();
    }
  }

  mouseover() {
    this.hover = true;
    this.text.cacheAsBitmap = false;
    this.text.alpha = 1;
    const parent = this.ctnr.parent;
    parent.removeChild(this.ctnr);
    parent.addChild(this.ctnr);
    if (this.tweening || this.locked) { return; }
    this.tweening = true;
    const ref = { scale: this.ctnr.scale.x };
    const scale = Math.max(hh / this.size / 5, 1.1);
    this.tween(ref)
      .to({ scale }, 300)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => this.ctnr.scale.set(ref.scale))
      .onComplete(() => this.tweening = false)
      .start();
  }

  mouseout() {
    this.hover = false;
    this.text.alpha = 0.5;
    if (!this.locked) { this.scaleOut(); }
  }

  render() {
    const graphics = new PIXI.Graphics();
    this.ctnr = graphics;
    graphics.beginFill(this.color, 0.9);
    graphics.drawCircle(0, 0, this.size);
    graphics.endFill();
    graphics.x = ww / 2;
    graphics.y = hh / 2;
    if (this.caption) {
      setTimeout(() => this.enabled = true, this.domain ? 2999 : 0);
      graphics.hitArea = new PIXI.Circle(0, 0, this.size);
      graphics.mouseover = () => this.mouseover();
      graphics.mouseout = () => this.mouseout();
      graphics.click = () => this.click();
      graphics.defaultCursor = 'pointer';
      const fontSize = this.size * 30 / this.caption.split('\n').shift().length;
      this.text = new PIXI.Text(this.caption, {
        fontFamily: 'Helvetica, Verdana, Arial', fontSize, fill: 0xffffff,
        fontWeight: 'bold', align: 'center'
      });
      this.text.alpha = 0.5;
      this.text.anchor.set(0.5, 0.5);
      this.text.scale.set(0.1);
      graphics.addChild(this.text);
      this.text.cacheAsBitmap = true;
    }
  }

  update() {
    if (this.locked || this.hover) { return; }
    this.ctnr.x += this.xSpeed * app.explosionForce;
    this.ctnr.y += this.ySpeed * app.explosionForce;
    if (this.ctnr.x + this.size > ww) {
      this.ctnr.x = ww - this.size;
      this.xSpeed *= -1;
    } else if (this.ctnr.x - this.size < 0) {
      this.ctnr.x = this.size;
      this.xSpeed *= -1;
    }
    if (this.ctnr.y + this.size > hh) {
      this.ctnr.y = hh - this.size;
      this.ySpeed *= -1;
    } else if (this.ctnr.y - this.size < 0) {
      this.ctnr.y = this.size;
      this.ySpeed *= -1;
    }
  }

  tween(obj) {
    const t = tween(obj);
    this.tweens.push(t);
    t.onComplete(() => _.pull(this.tweens, t));
    return t;
  }
}
