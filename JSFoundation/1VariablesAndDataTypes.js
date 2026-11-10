"use strict"

let i=0
let y = 90
let strName = "My Name"
let data = [10,20,30,40]
let myJson = {
    empid: 30,
    empName: "Bhaskar",
    empTech: {
        one:"java", 
        two:"JS",
        three:"TS", 
        four:"PW"
        }
}

console.log("i::"+i)
console.log("y::"+y)
console.log("data::"+data[0])
console.log("strName::"+strName)
console.log("myJson::"+myJson.empName)
console.log("myJsonTech::"+myJson.empTech.one)

console.log(typeof i)
console.log(typeof y)
console.log(typeof strName)
console.log(typeof data)
console.log(typeof myJson)
