import * as R from 'ramda';

// call examples
// timing: Timing.linear,
// timing: Timing.quad,
// timing: Timing.circ,
// timing: Timing.bounce,
// timing: Timing.makeEaseOut(Timing.bounce),
// timing: Timing.makeEaseInOut(Timing.bounce),
// timing: Timing.back(3.5),
// timing: Timing.elastic(1.5),
// timing: Timing.makeEaseInOut(Timing.poly(4)),

export class Timing {
  static linear(timeFraction: number): number {
    return timeFraction;
  }

  static quad(progress: number): number{
    return progress ** 2;
  }

  static poly = R.curry((x, progress) => (progress ** x));

  static circ(timeFraction: number): number {
    return 1 - Math.sin(Math.acos(timeFraction));
  }

  static back = R.curry((x, timeFraction) => (timeFraction ** 2) * ((x + 1) * timeFraction - x));

  static bounce(timeFraction: number): number {
    for (let a = 0, b = 1; ; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) {
        return -(((11 - 6 * a - 11 * timeFraction) / 4) ** 2) + (b ** 2);
      }
    }
  }

  static elastic = (x: number, timeFraction: number): number => 
    (2 ** (10 * (timeFraction - 1))) * 
    Math.cos(
      ((20 * Math.PI * x) / 3) * timeFraction
    );

  static makeEaseOut = (timing: (timeFraction: number) => number) => 
    function (timeFraction: number): number {
      return 1 - timing(1 - timeFraction);
    };

  static makeEaseInOut = (timing: (timeFraction: number) => number) => 
    function (timeFraction: number): number {
      if (timeFraction < 0.5) {
        return timing(2 * timeFraction) / 2;
      }
      return (2 - timing(2 * (1 - timeFraction))) / 2;
    };
}

export const animate = (options: {
  duration: number;
  timing: (timeFraction: number) => number,
  draw: (ttt: number) => void;
  loop?: boolean;
}) => {
  let start = performance.now();
  const animation = {
    enable: true,
  };

  requestAnimationFrame(function animate2(time) {
    // console.log(options.key || 'animation triggered');
    if (!animation.enable) return;

    // timeFraction from 0 to 1
    let timeFraction = (time - start) / options.duration;
    if (timeFraction > 1) timeFraction = 1;

    // current animation state
    const progress = options.timing(timeFraction);

    options.draw(progress);

    if (timeFraction < 1) {
      requestAnimationFrame(animate2);
    } else if (options.loop) {
      start += options.duration;
      requestAnimationFrame(animate2);
    }
  });
  return animation;
};