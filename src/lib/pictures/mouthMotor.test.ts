import { describe, expect, it } from 'vitest';
import { MOTOR_ANIMALS, MOTOR_EXERCISES, motorPictureUrl, motorSvg } from './mouthMotor';

describe('mouth motor pictures', () => {
  it('draws every exercise for every animal', () => {
    for (const animal of MOTOR_ANIMALS) {
      for (const exercise of MOTOR_EXERCISES) {
        const svg = motorSvg(animal, exercise);
        expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
        expect(svg).not.toContain('undefined');
        expect(motorPictureUrl(animal, exercise)).toMatch(/^data:image\/svg\+xml,%3Csvg/);
      }
    }
  });

  it('uses each exercise name once', () => {
    const labels = MOTOR_EXERCISES.map((e) => e.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('leaves out the rosy cheeks where the exercise draws its own', () => {
    const [dino] = MOTOR_ANIMALS;
    const puff = MOTOR_EXERCISES.find((e) => e.id === 'puff-cheeks')!;
    expect(motorSvg(dino, puff)).not.toContain(dino.blush);
  });
});
