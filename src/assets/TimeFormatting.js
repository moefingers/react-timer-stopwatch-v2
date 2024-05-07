export const unitInformationObject = {
    hours: {
      alias: "hrs",
      asMs: 3600000
    },
    minutes: {
      alias: "min",
      asMs: 60000
    },
    seconds: {
      alias: "sec",
      asMs: 1000
    }
  }

  export const defaultFormatSettings = {
    units: {
        hours: false,
        minutes: true,
        seconds: true,
    },
    decimalPlaces: 3
}
  
  
  export function turnMillisecondsPretty(milliseconds, settingsObject) {

    console.log(milliseconds)
    console.log(settingsObject)

    let divisorArray = []
    let lastUnit
    Object.keys(settingsObject.units).forEach((key) => {
        if (settingsObject.units[key]) {
            divisorArray.push(unitInformationObject[key].asMs)
            lastUnit = key
            console.log(key)
        }
    })
    let prettyArray = []
    let remainingMilliseconds = milliseconds
    let trailingDecimal = false
    divisorArray.forEach((divisor) => {
        let prettySection = Math.floor(remainingMilliseconds / divisor)
        if (prettySection.length <= 1){
            console.log(prettySection)
        }
        prettyArray.push(prettySection)
        remainingMilliseconds = remainingMilliseconds % divisor
        console.log(remainingMilliseconds)
        console.log(divisor)
        console.log(remainingMilliseconds / divisor)
        console.log(lastUnit)
        trailingDecimal = (remainingMilliseconds / divisor * (10 ** settingsObject.decimalPlaces)).toFixed(0)
        if(trailingDecimal == 0){trailingDecimal =""; for(let i = 0; i < settingsObject.decimalPlaces; i++){trailingDecimal += "0"}}
    })
    console.log(trailingDecimal)
    console.log(settingsObject.decimalPlaces)
    console.log( `${prettyArray.join(":")}${settingsObject.decimalPlaces != 0 ? "." + trailingDecimal : ""}`)
  
    // return `${prettyArray.join(":")}${settingsObject.unitsWithDecimals.seconds ? "." + trailingDecimal : ""}`
    return `${prettyArray.join(":")}${settingsObject.decimalPlaces != 0 ? "." + trailingDecimal : ""}`
  }
  
  export function turnPrettyTimeIntoMilliseconds(prettyTime, settingsObject, timeRegExp) {
    let calculatedms = 0
    let matchArray = timeRegExp?.exec(prettyTime)
    console.log(matchArray?.groups)
    matchArray?.groups != undefined && Object.keys(matchArray.groups).forEach((key) => {
        // key : matchArray.groups[key]
        if(!key.includes("_dec")){calculatedms += Number(matchArray.groups[key] * settingsObject.unitsAsMilliseconds[key])}
        if(key.includes("_dec")){
            console.log(key)
            console.log(matchArray.groups[key])
            console.log(settingsObject.unitsAsMilliseconds[key])
            calculatedms += Number(("0." + matchArray.groups[key]) * settingsObject.unitsAsMilliseconds[key])}
    })
    return calculatedms
  }