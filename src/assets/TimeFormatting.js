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

    // console.log(milliseconds)
    let divisorArray = []
    let lastUnit
    let lastDivisor
    Object.keys(settingsObject.units).forEach((key) => {
        if (settingsObject.units[key]) {
            divisorArray.push(unitInformationObject[key].asMs)
            lastUnit = key
            lastDivisor = unitInformationObject[key].asMs
        }
    })
    let prettyArray = []
    let remainingMilliseconds = milliseconds
    divisorArray.forEach((divisor) => {
        let prettySection
        if (lastDivisor == divisor){
          prettySection = (remainingMilliseconds / divisor).toFixed(settingsObject.decimalPlaces).toString()

          if(Math.floor(remainingMilliseconds / divisor).toString().length < 2){
            prettySection = "0" + prettySection
          }
        }
        else {
          prettySection = Math.floor(remainingMilliseconds / divisor).toString()
          remainingMilliseconds = remainingMilliseconds % divisor
        }

        if(prettySection.length < 2){prettySection = "0" + prettySection}
        prettyArray.push(prettySection)
    })
    
    return `${prettyArray.join(":")}`
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