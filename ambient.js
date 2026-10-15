/* Ambient details for the illustrated forest. No assets, dependencies, or RAF. */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;
  var SOURCE_WIDTH = 1024;
  var SOURCE_HEIGHT = 572;

  function randomGenerator(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var n = Math.imul(seed ^ seed >>> 15, 1 | seed);
      n ^= n + Math.imul(n ^ n >>> 7, 61 | n);
      return ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }

  function ellipse(ctx, x, y, rx, ry, rotation) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation || 0, 0, TAU);
    ctx.fill();
  }

  function ForestAmbient(canvas) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new TypeError('ForestAmbient requires a canvas.');
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.viewport = {
      width: canvas.clientWidth || SOURCE_WIDTH,
      height: canvas.clientHeight || SOURCE_HEIGHT,
      imageX: 0, imageY: 0,
      imageWidth: canvas.clientWidth || SOURCE_WIDTH,
      imageHeight: canvas.clientHeight || SOURCE_HEIGHT
    };
    this.options = { paused: false, reducedMotion: false, quality: 'high' };
    this.elapsed = 0;
    this.lastTime = null;
    this.destroyed = false;
    var random = randomGenerator(73915);
    var areas = [
      [25, 225, 170, 330], [68, 55, 146, 155],
      [370, 218, 170, 85], [739, 235, 220, 80],
      [743, 438, 235, 111], [300, 36, 284, 99]
    ];
    this.fireflies = Array.from({ length: 32 }, function (_, i) {
      var area = areas[i % areas.length];
      return {
        x: area[0] + random() * area[2], y: area[1] + random() * area[3],
        phase: random() * TAU, speed: 0.32 + random() * 0.42,
        radius: 0.55 + random() * 0.8, drift: 3 + random() * 6,
        cool: i % 7 === 0
      };
    });
    this.leaves = Array.from({ length: 7 }, function (_, i) {
      return {
        x: 70 + random() * 890, y: random() * 620,
        phase: random() * TAU, speed: 6 + random() * 6,
        size: 2.1 + random() * 1.8, foreground: i < 2
      };
    });
    this.sparks = Array.from({ length: 10 }, function () {
      return { phase: random(), sway: random() * TAU, speed: 0.22 + random() * 0.17 };
    });
    this.butterflies = [
      { x: 150, y: 333, phase: 0.3, color: '#b3f7de', size: 2.7 },
      { x: 819, y: 260, phase: 2.8, color: '#e4f59a', size: 2.3 },
      { x: 451, y: 89, phase: 5.4, color: '#c1e8f5', size: 2.8 }
    ];
  }

  ForestAmbient.prototype.setViewport = function (viewport) {
    if (!viewport) return;
    var current = this.viewport;
    ['width', 'height', 'imageX', 'imageY', 'imageWidth', 'imageHeight'].forEach(function (key) {
      if (Number.isFinite(viewport[key])) current[key] = viewport[key];
    });
  };

  ForestAmbient.prototype.setOptions = function (options) {
    if (!options) return;
    if (typeof options.paused === 'boolean') this.options.paused = options.paused;
    if (typeof options.reducedMotion === 'boolean') this.options.reducedMotion = options.reducedMotion;
    if (options.quality !== undefined) this.options.quality = options.quality;
  };

  ForestAmbient.prototype.render = function (timeMs, parallaxX, parallaxY) {
    if (this.destroyed || !this.ctx) return;
    var ctx = this.ctx;
    var viewport = this.viewport;
    var now = Number.isFinite(timeMs) ? timeMs : 0;
    var delta = this.lastTime === null ? 0 : Math.max(0, Math.min(now - this.lastTime, 80));
    this.lastTime = now;
    if (!this.options.paused && !this.options.reducedMotion) this.elapsed += delta / 1000;
    var t = this.elapsed;
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    if (viewport.imageWidth <= 0 || viewport.imageHeight <= 0) return;
    var quality = this.options.quality;
    var low = quality === 'low' || quality === 'performance' || (typeof quality === 'number' && quality < 0.6);
    var reduced = this.options.reducedMotion;
    ctx.save();
    ctx.beginPath();
    ctx.rect(viewport.imageX, viewport.imageY, viewport.imageWidth, viewport.imageHeight);
    ctx.clip();
    ctx.translate(viewport.imageX, viewport.imageY);
    ctx.scale(viewport.imageWidth / SOURCE_WIDTH, viewport.imageHeight / SOURCE_HEIGHT);
    // Pointer offsets are CSS pixels. Only floating details receive the offset.
    var px = (Number(parallaxX) || 0) * SOURCE_WIDTH / viewport.imageWidth;
    var py = (Number(parallaxY) || 0) * SOURCE_HEIGHT / viewport.imageHeight;

    if (!low) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      var beams = [[198, -30, 286, 210, 34], [286, -35, 396, 190, 24], [560, -35, 623, 136, 27]];
      beams.forEach(function (beam, i) {
        var brightness = 0.028 + Math.sin(t * 0.19 + i * 1.7) * 0.006;
        var gradient = ctx.createLinearGradient(beam[0], beam[1], beam[2], beam[3]);
        gradient.addColorStop(0, 'rgba(242,255,202,0)');
        gradient.addColorStop(0.25, 'rgba(242,255,202,' + brightness + ')');
        gradient.addColorStop(0.75, 'rgba(242,255,202,' + (brightness * 0.7) + ')');
        gradient.addColorStop(1, 'rgba(242,255,202,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(beam[0] - 3, beam[1]);
        ctx.lineTo(beam[0] + 4, beam[1]);
        ctx.lineTo(beam[2] + beam[4], beam[3]);
        ctx.lineTo(beam[2] - beam[4], beam[3]);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    // A small warm bloom stays anchored to the painted campfire.
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    var flicker = 0.8 + 0.13 * Math.sin(t * 8) + 0.07 * Math.sin(t * 13.7);
    var glow = ctx.createRadialGradient(459, 194, 1, 459, 194, 20);
    glow.addColorStop(0, 'rgba(255,187,57,' + (0.17 * flicker) + ')');
    glow.addColorStop(0.35, 'rgba(255,157,38,' + (0.065 * flicker) + ')');
    glow.addColorStop(1, 'rgba(255,153,35,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(438, 173, 42, 42);
    if (!reduced) {
      this.sparks.forEach(function (spark, i) {
        if (low && i % 2) return;
        var life = (t * spark.speed + spark.phase) % 1;
        var opacity = Math.sin(life * Math.PI) * 0.75;
        var x = 460 + Math.sin(life * 5 + spark.sway) * (2 + life * 6);
        var y = 191 - life * 29;
        ctx.fillStyle = 'rgba(255,209,108,' + opacity + ')';
        ellipse(ctx, x, y, 0.5, 0.8, 0);
      });
    }
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    this.fireflies.forEach(function (fly, i) {
      if ((low || reduced) && i % 2) return;
      var pulse = Math.max(0, Math.sin(t * fly.speed + fly.phase));
      var alpha = 0.13 + Math.pow(pulse, 2.5) * 0.65;
      var x = fly.x + Math.sin(t * 0.25 + fly.phase) * fly.drift + px * 0.3;
      var y = fly.y + Math.cos(t * 0.31 + fly.phase) * fly.drift * 0.6 + py * 0.3;
      var color = fly.cool ? '160,255,229' : '233,255,155';
      var halo = ctx.createRadialGradient(x, y, 0, x, y, fly.radius * 5);
      halo.addColorStop(0, 'rgba(' + color + ',' + alpha * 0.35 + ')');
      halo.addColorStop(1, 'rgba(' + color + ',0)');
      ctx.fillStyle = halo;
      ellipse(ctx, x, y, fly.radius * 5, fly.radius * 5, 0);
      ctx.fillStyle = 'rgba(' + color + ',' + alpha + ')';
      ellipse(ctx, x, y, fly.radius, fly.radius, 0);
    });
    ctx.restore();

    if (!reduced) {
      this.leaves.forEach(function (leaf, i) {
        if (low && i > 2) return;
        var y = ((leaf.y + t * leaf.speed) % 640) - 35;
        var x = leaf.x + Math.sin(t * 0.24 + leaf.phase) * 33;
        var edgeFade = Math.min(1, Math.max(0, y / 45), Math.max(0, (590 - y) / 45));
        ctx.save();
        ctx.translate(x + px * (leaf.foreground ? 0.8 : 0.3), y + py * 0.4);
        ctx.rotate(Math.sin(t * 0.7 + leaf.phase) * 0.65 + leaf.phase);
        ctx.scale(0.45 + Math.abs(Math.cos(t * 0.8 + leaf.phase)) * 0.55, 1);
        ctx.globalAlpha = (leaf.foreground ? 0.58 : 0.43) * edgeFade;
        ctx.fillStyle = i % 3 === 0 ? '#b8cb67' : '#77a469';
        ctx.beginPath();
        ctx.moveTo(0, -leaf.size * 1.8);
        ctx.quadraticCurveTo(leaf.size * 1.5, -leaf.size * 0.3, 0, leaf.size * 1.7);
        ctx.quadraticCurveTo(-leaf.size * 1.1, 0, 0, -leaf.size * 1.8);
        ctx.fill();
        ctx.restore();
      });

      this.butterflies.forEach(function (butterfly, i) {
        if (low && i > 0) return;
        var phase = butterfly.phase;
        var x = butterfly.x + Math.sin(t * 0.33 + phase) * 19 + px * 0.4;
        var y = butterfly.y + Math.cos(t * 0.47 + phase) * 8 + py * 0.4;
        var flap = 0.25 + Math.abs(Math.sin(t * 9 + phase)) * 0.75;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.sin(t * 0.4 + phase) * 0.2);
        ctx.globalAlpha = 0.72;
        ctx.fillStyle = butterfly.color;
        var size = butterfly.size;
        ellipse(ctx, -size * flap * 0.65, -0.6, size * flap, size * 0.6, -0.45);
        ellipse(ctx, size * flap * 0.65, -0.6, size * flap, size * 0.6, 0.45);
        ellipse(ctx, -size * flap * 0.45, 1.1, size * flap * 0.55, size * 0.42, 0.3);
        ellipse(ctx, size * flap * 0.45, 1.1, size * flap * 0.55, size * 0.42, -0.3);
        ctx.fillStyle = '#527f6c';
        ellipse(ctx, 0, 0, 0.4, size * 0.65, 0);
        ctx.restore();
      });
    }
    ctx.restore();
  };

  ForestAmbient.prototype.destroy = function () {
    if (this.ctx) this.ctx.clearRect(0, 0, this.viewport.width, this.viewport.height);
    this.destroyed = true;
    this.ctx = null;
    this.canvas = null;
    this.fireflies = this.leaves = this.sparks = this.butterflies = [];
  };

  global.ForestAmbient = ForestAmbient;
})(window);
