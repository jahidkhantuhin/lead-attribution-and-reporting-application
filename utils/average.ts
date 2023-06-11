export default function average(numbers: Array<number>) {
  var sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    // @ts-ignore
    sum += parseInt(numbers[i], 10);
  }

  return sum / numbers.length;
}
