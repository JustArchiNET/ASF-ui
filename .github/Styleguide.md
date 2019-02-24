# Styleguide

In order to maintain a readable codebase it's important to follow our styleguide. If you are unsure about something that this styleguide is not covering, just remember: Always go for readability.

## Quick Overview

- [Use single quotes for strings](#use-single-quotes-for-strings)
- [No unused variables](#no-unused-variables)
- [Add a space after keywords](#add-a-space-after-keywords)
- [Always use === instead of ==](#always-use--instead-of-)
- [Add a space after commas](#add-a-space-after-commas)
- [Keep else statements on the same line as curly braces](#keep-else-statements-on-the-same-line-as-curly-braces)
- [Use curly braces for multi-line if statements](#use-curly-braces-for-multi-line-if-statements)
- [Write each declaration in its own statement](#write-each-declaration-in-its-own-statement)
- [Add spaces inside single line blocks](#add-spaces-inside-single-line-blocks)
- [Use camelcase when naming variables and functions](#use-camelcase-when-naming-variables-and-functions)
- [No trailing commas](#no-trailing-commas)
- [Add a space between colon and value in key value pairs](#add-a-space-between-colon-and-value-in-key-value-pairs)
- [No floating decimals](#no-floating-decimals)
- [Add a space before blocks](#add-a-space-before-blocks)
- [Use spaces inside comments](#use-spaces-inside-comments)
- [Avoid Yoda conditions](#avoid-yoda-conditions)


## Rules

#### **Use single quotes for strings**

```javascript
console.log('ASF-ui');
console.log(`New version: $(version)`);
```
---

#### **No unused variables**

```javascript
myFunction () {
  let newVal = someFunction();   // ✗ avoid
  let result = otherFunction();
  return result;
}
```
---

#### **Add a space after keywords**

```javascript
if (condition) { ... }   // ✓ ok
if(condition) { ... }    // ✗ avoid
```
---

#### **Always use === instead of ==**

```javascript
if (name === 'John')   // ✓ ok
if (name == 'John')    // ✗ avoid
```

```javascript
if (name !== 'John')   // ✓ ok
if (name != 'John')    // ✗ avoid
```

*Exception: `obj == null` is allowed to check for `null` or `undefined`*

---

#### **Add a space after commas**

```javascript
// ✓ ok
var list = [1, 2, 3, 4]
function greet (name, options) { ... }
```

```javascript
// ✗ avoid
var list = [1,2,3,4]
function greet (name,options) { ... }
```
---

#### **Keep else statements on the same line as curly braces**

```javascript
// ✓ ok
if (condition) {
  // ...
} else {
  // ...
}
```

```javascript
// ✗ avoid
if (condition) {
  // ...
}
else {
  // ...
}
```
---

#### **Use curly braces for multi-line if statements**

```javascript
// ✓ ok
if (options.quiet !== true) console.log('done')
```

```javascript
// ✓ ok
if (options.quiet !== true) {
  console.log('done')
}
```

```javascript
// ✗ avoid
if (options.quiet !== true)
  console.log('done')
```
---

#### **Write each declaration in its own statement**

```javascript
// ✓ ok
let silent = true
let running = true
```

```javascript
// ✗ avoid
let silent = true, running = true
```

```javascript
// ✗ avoid
let silent = true,
    running = true
```
---

#### **Add spaces inside single line blocks**

```javascript
components: {AsfLogs}    // ✗ avoid
components: { AsfLogs }  // ✓ ok
``` 
---
  
#### **Use camelcase when naming variables and functions**

```javascript
my_function () { }    // ✗ avoid
myFunction () { }     // ✓ ok
```

```javascript
let my_value = 'hello'           // ✗ avoid
let myValue = 'hello'            // ✓ ok
```
---

#### **No trailing commas**

```javascript
var obj = {
  message: 'hello',   // ✗ avoid
}
```
---

#### **Add a space between colon and value in key value pairs**

```javascript
let obj = { 'key' : 'value' }    // ✗ avoid
let obj = { 'key' :'value' }     // ✗ avoid
let obj = { 'key':'value' }      // ✗ avoid
let obj = { 'key': 'value' }     // ✓ ok
```
---

#### **No floating decimals**

```javascript
const value = .5      // ✗ avoid
const value = 0.5     // ✓ ok
```

*Exception: `transition`*

---

#### **Add a space before blocks**

```javascript
if (admin){...}     // ✗ avoid
if (admin) {...}    // ✓ ok
```
---

#### **Use spaces inside comments**

```javascript
//comment           // ✗ avoid
// comment          // ✓ ok
```

```javascript
/*comment*/         // ✗ avoid
/* comment */       // ✓ ok
```
---

#### **Avoid Yoda conditions**

```javascript
if (42 === age) { }    // ✗ avoid
if (age === 42) { }    // ✓ ok
```
---
