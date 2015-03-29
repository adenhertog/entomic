# entomic
***An HTML templating engine***

## Usage

```js
var Entomic = require('entomic');
var fs = require('fs');

var entomic = new Entomic();
var rendered = entomic.transform("<html><body><contact-details><phone>123</phone></contact-details></body></html>");
fs.writeFileSync("output.html", rendered.html);
```

### constructor(options)

#### options.componentPath

Folder path where entomic components are located.

Type: `String`
Default: `node_modules`