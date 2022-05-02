# light-random

Ultra-lightweight, cryptographically weak, alphanumerical, package-independent random string generator.

### Installation

`npm install --save light-random`

or

`yarn add light-random`

### API

**`lightRandom(length: number): string`**

Default length: 8

### Usage

Require module
```javascript
const lightRandom = require('light-random');
```

or import with ES6

```javascript
import {lightRandom} from 'light-random';
```

Then call it

```javascript
lightRandom();
//default length: 8
//outputs 'bkiVCGkd'

lightRandom(15);
//outputs 'NPf78EK3oNPiU3t'

lightRandom(50);
//outputs 'TXU8A9K2cPfA4y76IXy3o4x6SQlxTLA26HOMLklVo4vJ0Rxjdv'
```

### License

MIT.