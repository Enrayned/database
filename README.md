## Imports

```js
import { Db } from "@enrayned/db";
// or
const { Db } = require("@enrayned/db");
```

## Usage

```js
const dbOptions = {
  path: string, //default enrayned
  file: string, //default database
  type: "json" | "bson" | "yaml", //default json
};
const db = new Db(dbOptions);
db.set("users.111", { name: "SeneSatka", id: "111" });
/**
{"users":{"111":{"name":"SeneSatka","id":"111"}}}
 */
db.push("users.111.inventory", { name: "Sword", damage: 10, level: 1 });
/**....
"inventory":[{ name: "Sword", damage: 10, level: 1 }]
....*/
db.push("users.111.inventory", { name: "bow", damage: 20, level: 4 });
/**....
"inventory":[
{ name: "Sword", damage: 10, level: 1 },
{ name: "bow", damage: 20, level: 4 }
]
....*/
db.pull("users.111.inventory", { name: "Sword", damage: 10, level: 1 });
/**....
"inventory":[
{ name: "bow", damage: 20, level: 4 }
]
....*/
db.delete("users.111.inventory");

db.all();
// [ { id: 'users', data: { '111':{"name":"SeneSatka","id":"111" }}} ]
db.deleteAll();
```

## Emitter

```js
/** database.json
 {
    "name":"SeneSatka"
 }
 */
db.on("set", (data) => {
  console.log(data);
});
db.set("name", "Testt");
/** set listener output
 { key: 'name', oldValue: 'SeneSatka', newValue: 'Testt' }
  */
```
