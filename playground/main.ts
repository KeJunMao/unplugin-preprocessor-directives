/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/indent */
/* prettier-ignore */
document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

// #error this is an error message
// #warning this is a warning message
// #info this is an info message

console.log(1)
// #if DEV
  console.log(2)
  // #if ASD != '233'
  console.log(3)
  // #endif
console.log(4)
// #elif NODE_ENV == 'development'
console.log(5)
// #elif VC6
console.log(6)
// #else
console.log(7)
// #endif

console.log(8)

// #if DEBUG
console.log(9)
// #else
console.log(10)
// #endif
