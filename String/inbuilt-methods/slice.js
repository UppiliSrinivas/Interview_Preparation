function sumAsciiWithCharCodeAt(str) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }
  return sum;
}

// Test
console.log(sumAsciiWithCharCodeAt("nivas")); // "v"
console.log(sumAsciiWithCharCodeAt("hello")); // "l"
console.log(sumAsciiWithCharCodeAt("even")); // "ve"
