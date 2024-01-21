// #if DEV
console.log('DEV')
// #endif

// #if !DEV
console.log('!DEV')
// #else
console.log('!DEV else')
// #endif

// #if !DEV
console.log('!DEV')
// #elif TEST
console.log('TEST')
// #else
console.log('!DEV else')
// #endif

// #if DEV
// #if !TEST
console.log('!DEV !TEST')
// #else
console.log('else')
// #endif
// #endif
