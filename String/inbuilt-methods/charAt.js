function getMiddleChar(str) {
  const len = str.length;
  const mid = Math.floor(len / 2);
  return len % 2 === 0 ? str.charAt(mid - 1) + str.charAt(mid) : str.charAt(mid);
}

console.log(getMiddleChar("nivas")); // "v"
console.log(getMiddleChar("hello")); // "l"
console.log(getMiddleChar("even")); // "ve"
