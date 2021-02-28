export function range(start: number, end?: number): number[] {
  // If the second parameter omitted, assume the range spans 0..start
  if (end === undefined) {
    end = start;
    start = 0;
  }

  const array = [];
  if (start < end) {
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
  } else {
    for (let i = start; i >= end; i--) {
      array.push(i);
    }
  }

  return array;
}

export function randomBetween(start: number, end: number): number {
  return Math.random() * Math.abs(start - end) + start;
}
