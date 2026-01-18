export type SeededRandom = {
  seed: number;
  next(): number;
  nextInt(max: number): number;
  nextRange(min: number, max: number): number;
  nextIntRange(min: number, max: number): number;
};

/**
 * Создает детерминистичный генератор случайных чисел на основе seed.
 * Использует LCG (Linear Congruential Generator) алгоритм.
 *
 * @param seed - Начальное значение для генератора
 * @returns Объект SeededRandom с методами генерации чисел
 */
export function createSeededRandom(seed: number): SeededRandom {
  return {
    seed,
    next() {
      // LCG algorithm (parameters from glibc)
      this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
      return this.seed / 0x7fffffff;
    },
    nextInt(max: number) {
      return Math.floor(this.next() * max);
    },
    nextRange(min: number, max: number) {
      return min + this.next() * (max - min);
    },
    nextIntRange(min: number, max: number) {
      return min + this.nextInt(max - min + 1);
    },
  };
}
