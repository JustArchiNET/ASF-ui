# Styleguide

In order to maintain a readable codebase it's important to follow our styleguide.

## Rules

#### **Use single quotes for strings**

```javascript
console.log('ASF-ui');
console.log(`New version: $(version)`);
```

#### **No unused variables**

```javascript
myFunction () {
  let newVal = someFunction();   // ✗ avoid
  let result = otherFunction();
  return result;
}
```

#### **Add a space after keywords**

```javascript
if (condition) { ... }   // ✓ ok
if(condition) { ... }    // ✗ avoid
```

#### **Always use === instead of ==**

*Exception: `obj == null` is allowed to check for `null` or `undefined`*

```javascript
if (name === 'John')   // ✓ ok
if (name == 'John')    // ✗ avoid
```

```javascript
if (name !== 'John')   // ✓ ok
if (name != 'John')    // ✗ avoid
```

#### **Commas should have a space after them**

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

#### **Keep else statements on the same line as their curly braces**

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

#### **For the ternary operator in a multi-line setting, place ? and : on their own lines**

```javascript
// ✓ ok
var location = env.development ? 'localhost' : 'www.api.com'
```

```javascript
// ✓ ok
var location = env.development
  ? 'localhost'
  : 'www.api.com'
```

```javascript
// ✗ avoid
var location = env.development ?
  'localhost' :
  'www.api.com'
```

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

#### **Add spaces inside single line blocks**

```javascript
components: {AsfLogs}    // ✗ avoid
components: { AsfLogs }  // ✓ ok
```  
  
#### **Use camelcase when naming variables and functions**

```javascript
my_function () { }    // ✗ avoid
myFunction () { }     // ✓ ok
```

```javascript
let my_value = 'hello'           // ✗ avoid
let myValue = 'hello'            // ✓ ok
```

#### **Trailing commas are not allowed**

```javascript
var obj = {
  message: 'hello',   // ✗ avoid
}
```

#### **Add space between colon and value in key value pairs**

```javascript
let obj = { 'key' : 'value' }    // ✗ avoid
let obj = { 'key' :'value' }     // ✗ avoid
let obj = { 'key':'value' }      // ✗ avoid
let obj = { 'key': 'value' }     // ✓ ok
```

#### **No floating decimals**

*Exception: `transition`*

```javascript
const value = .5      // ✗ avoid
const value = 0.5     // ✓ ok
```

#### **Must have a space before blocks**

```javascript
if (admin){...}     // ✗ avoid
if (admin) {...}    // ✓ ok
```

#### **Use spaces inside comments**

```javascript
//comment           // ✗ avoid
// comment          // ✓ ok
```

```javascript
/*comment*/         // ✗ avoid
/* comment */       // ✓ ok
```

#### **Avoid Yoda conditions**

```javascript
if (42 === age) { }    // ✗ avoid
if (age === 42) { }    // ✓ ok
```
