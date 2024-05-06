import React, { useState, useRef, useEffect } from 'react'

import { fadeOpacityIn, slideAndFadeInFromLeft, slideAndFadeInFromRight, slideAndFadeOutToRight, slideAndFadeOutToLeft, expandToWidthThenToHeight } from '../../assets/Animations'

import {turnMillisecondsPretty, defaultFormatSettings} from '../../assets/TimeFormatting'

import {useInterval} from 'usehooks-ts'

export default function Stopwatch() {

    //states
    const [timeOfLastStopwatchChange, setTimeOfLastStopwatchChange] = useState(Date.now()) // Time of Last Stopwatch Change // time stamp IE 1714009411220 ms
    const [lastStoppedStopwatchTime, setLastStoppedStopwatchTime] = useState(0) // Old Stopwatch Time to record previous active time // Not timestamp IE 3000 ms
    const [lastLapStopwatchTime, setLastLapStopwatchTime] = useState(0) // Old Stopwatch Time to record previous lap time // Not timestamp IE 3000 ms
    const [avgLapTime, setAvgLapTime] = useState(0) // stored average lap time
    const [avgLapTimeWithoutStopped, setAvgLapTimeWithoutStopped] = useState(0) // stored avg lap time excluding stpped times
    const [stopwatchTime, setStopwatchTime] = useState(0) // Stopwatch Time (total time while active) // Not timestamp IE 3123 ms
    const [useIntervalActive, setUseIntervalActive] = useState(false) // Use Interval Active State (to turn on and on recording of time difference since last activation)// true = on / false = off
    const [lapAndStopped, setLapAndStopped] = useState(false)

    const defaultStopwatchObjectEntry = { 
        storedTime: 0, 
        name: "Stopwatch 0",
        timeArray: [],
        avgLapTime: 0,
        avgLapTimeWithoutStoppedTimes: 0,
        formatSettings: defaultFormatSettings,
    }
    // initialize stopwatch object with one entry and set it as current using 0 key
    const [stopwatchObject, setStopwatchObject] = useState({0: defaultStopwatchObjectEntry})
    const [currentStopwatchObjectIndex, setCurrentStopwatchObjectIndex] = useState(0)
    useEffect(() => {
        
    }, [currentStopwatchObjectIndex])


    function runStopWatch() {
        setTimeOfLastStopwatchChange(Date.now()) // freshen time stamp A
        setLastStoppedStopwatchTime(stopwatchTime) // document old time
        
      
        if(stopwatchTime > 0 && useIntervalActive){addLapTimeToStopwatchArray("Stopped")}
        !useIntervalActive && setLapAndStopped(false)
        setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval
    }
    function addLapTimeToStopwatchArray(reason) {
        setLastLapStopwatchTime(stopwatchTime)
        if(stopwatchTime === 0) return
        let alreadyContainsTimeType = ""  // initialize already contains situation
        let indexOfTimeObjectToUpdate
        let lapArray = []
        let lapArrayWithoutStopped = []
        let totalLapTime = 0
        let totalLapTimeWithoutStopped = 0
        stopwatchObject[currentStopwatchObjectIndex].timeArray.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
            lapArray.push(object.lastDifference)
            totalLapTime += object.lastDifference
            if(object.reason !== 'Stopped'){
            lapArrayWithoutStopped.push(object.lastDifference);
            totalLapTimeWithoutStopped += object.lastDifference
            }
            if(object.time === stopwatchTime){ // if time is the same
            if (object.reason === 'Stopped') {alreadyContainsTimeType = "Stopped"; indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
            else if (object.reason === 'Lap' || object.reason === 'Stop + Lap') {alreadyContainsTimeType = "Lap"} // already contains time of LAP or STOPPED AND LAP reason
            }
        }) // end for each 
    
        if(alreadyContainsTimeType == "Stopped"){ // if already contains time of the STOPPED reason
            let {lastDifference} = stopwatchObject[currentStopwatchObjectIndex].timeArray[indexOfTimeObjectToUpdate] // destructure last difference
            stopwatchObject[currentStopwatchObjectIndex].timeArray.splice(indexOfTimeObjectToUpdate, 1) // remove the old one from the array of times
            updateObjectEntry(
                stopwatchObject,
                currentStopwatchObjectIndex, 
                {timeArray: [
                    ...stopwatchObject[currentStopwatchObjectIndex].timeArray,
                    {time: stopwatchTime, lastDifference: lastDifference, reason: 'Stop + Lap'}
                ]}
            )
        
        
            setLapAndStopped(true)
        }
        if (alreadyContainsTimeType == "" || reason == "Stopped") { // add time with LAP type if it doesn't already exist as any other type

            updateObjectEntry(
                stopwatchObject, 
                currentStopwatchObjectIndex,
                {timeArray: [
                    ...stopwatchObject[currentStopwatchObjectIndex].timeArray, 
                    {time: stopwatchTime, lastDifference: stopwatchTime - lastLapStopwatchTime, reason: typeof reason == 'string' && reason || 'Lap'}
                ]}
            )
          
        } // include old array and tag on time with LAP reason
        let divisor = lapArray.length == 0 ? 1 : lapArray.length
        console.log(`${totalLapTime} / ${divisor}`)
        setAvgLapTime(totalLapTime / divisor)
    
        let divisorWithoutStopped = lapArrayWithoutStopped.length == 0 ? 1 : lapArrayWithoutStopped.length
        console.log(`${totalLapTimeWithoutStopped} / ${divisorWithoutStopped}`)
        setAvgLapTimeWithoutStopped(totalLapTimeWithoutStopped / divisorWithoutStopped)
    }   
    useInterval(() => {
        setStopwatchTime(lastStoppedStopwatchTime + Date.now() - timeOfLastStopwatchChange)
    }, useIntervalActive ? 10 : null)


    //generic updateObjectEntry function
    function updateObjectEntry(fullObject, entryKey, entryValue) {
        let updatedObject = Object.assign(
            {}, 
            fullObject, 
            {[entryKey]: Object.assign(
                {}, 
                fullObject[entryKey], 
                entryValue)
            }
        )
        setStopwatchObject(updatedObject)

        console.log(updatedObject)
    }

    const stopwatchWrapper = useRef(null)
    function navigateToKeyFromObject(destinationKey, fullObject, setCurrentKeyFunction, oldKey, element, force) {
        let aboveMaxIndex = Object.keys(fullObject).length

        if((destinationKey < aboveMaxIndex && destinationKey >= 0) || force) {
            // decide animation behavior
            let [firstAnim, secondAnim] = []
            if(destinationKey > oldKey) { // animate to left
                [firstAnim, secondAnim] = [slideAndFadeOutToLeft, slideAndFadeInFromRight]
            } else if (destinationKey < oldKey) { // animate to right
                [firstAnim, secondAnim] = [slideAndFadeOutToRight, slideAndFadeInFromLeft]
            }
            element.animate(firstAnim, 500)
            // wait before animating second animation
            setTimeout(() => { // update current key and run second animation
                setCurrentKeyFunction(destinationKey) 
                element.animate(secondAnim, 500)
            }, 500)


        } else {
            console.log(`Destination index ( ${destinationKey} ) not in index range ( 0 - ${aboveMaxIndex - 1} ).`)
        }
    }

    const [contracted, setContracted] = useState(true)
    return (
        <div className="stopwatch-section">
            
            <div ref={stopwatchWrapper} className={`stopwatch-wrapper ${contracted ? 'stopwatch-wrapper-contracted' : ''}`}>
                <button className={`stopwatch-button expand-contract-stopwatch ${contracted ? 'expand-contract-stopwatch-contracted' : ''}`}  onClick={() => setContracted(!contracted)}>{contracted ? '➕' : '➖'}</button>
                <div className={`test-child ${contracted ? 'test-child-altered' : ''}`}>
                    {stopwatchTime}
                </div>
                <div className={`stopwatch-startstop-lap-container ${contracted ? 'stopwatch-startstop-lap-container-contracted' : ''}`}>
                    <button className="stopwatch-button" onClick={(event) => {event.stopPropagation(); runStopWatch()}}>{useIntervalActive ? 'Stop' : 'Start'}</button>
                    <button className="stopwatch-button" onClick={(event) => {event.stopPropagation(); addLapTimeToStopwatchArray("Lap")}}>Lap</button>
                </div>
            </div>
            <button className={`stopwatch-button add-stopwatch-entry`} onClick={(event) => {event.stopPropagation();
            updateObjectEntry(stopwatchObject, Object.entries(stopwatchObject).length, Object.assign({}, defaultStopwatchObjectEntry, {name: `Stopwatch ${Object.entries(stopwatchObject).length}`}));
            navigateToKeyFromObject(Object.entries(stopwatchObject).length, stopwatchObject, setCurrentStopwatchObjectIndex, currentStopwatchObjectIndex, stopwatchWrapper.current, true)}}
            >New</button>
            <button className={`stopwatch-button stopwatch-navigation`} onClick={(event) => navigateToKeyFromObject(currentStopwatchObjectIndex - 1, stopwatchObject, setCurrentStopwatchObjectIndex, currentStopwatchObjectIndex, stopwatchWrapper.current)}>&lt;</button>
            <input className="stopwatch-title" value={stopwatchObject[currentStopwatchObjectIndex].name} onChange={(event) => updateObjectEntry(stopwatchObject, currentStopwatchObjectIndex, Object.assign({}, stopwatchObject[currentStopwatchObjectIndex], {name: event.target.value}))}/>
            <button className={`stopwatch-button stopwatch-navigation`} onClick={(event) => navigateToKeyFromObject(currentStopwatchObjectIndex + 1, stopwatchObject, setCurrentStopwatchObjectIndex, currentStopwatchObjectIndex, stopwatchWrapper.current)}>&gt;</button>

            <button onClick={() => console.log(turnMillisecondsPretty(900000, stopwatchObject[currentStopwatchObjectIndex].formatSettings))} className="stopwatch-button">Test x ms</button>
        </div>
    )
}