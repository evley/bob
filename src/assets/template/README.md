# BOB.evley.app CSV Data Template


### Data format
The above headers, with their data format is expected. However, how you decide they data is represented is up to you.


| Header | Type | Description |
| :--- | :--- | :--- |
| ID | `string` | ID of the item. Useful if you have multiple items of the same name. I actually write the ID on the item in question such as a tin of beans. |
| Name | `string` | The name of the item you are adding. Helpful to be as descriptive as you feel you need to understand what this item is. |
| Quantity | `number` | The quantity of the item. As granular as you wish. For example, you can make a pack of paracetamol of 1 or 8 individual tablets. |
| Type | `string` | Name of the type. Ideally, you should be consistent to maintain a type ording list. I.e. Medical, Tool, Food, or Water. |
| Location | `string` | Name of a place to represent the location. Ideally, you should be consistent to maintain a location ording list. I.e. BOB, Utility, or Car. |
list. I.e. Medical, Tool, Food, or Water. |
| Added | `date` | Date in which you added the item. NOTE: maintain a correct date format. Would recommend YYYY-MM-DD such as 2016-10-01. |
| Expiry | `date` | Date in which the item expires. NOTE: maintain a correct date format. Would recommend YYYY-MM-DD such as 2016-10-01. |
| Checked | `date` | Date in which you last checked the item. NOTE: maintain a correct date format. Would recommend YYYY-MM-DD such as 2016-10-01. |
| Calories | `number` | Number of calories the item represents. For example we use this to calculate total calories stored in location. NOTE: Expects Kcal number. |
| Water | `number` | Number of water ml(millilitres) the item represents. For example we use this to calculate total water stored in location. NOTE: Expects ml number. |


### Example CSV

An [example CSV](https://github.com/evley/bob/tree/master/src/assets/template/example.csv) to download, edit, and upload.
