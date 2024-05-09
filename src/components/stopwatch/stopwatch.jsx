import React, { useState, useRef, useEffect } from 'react'

import { 
    fadeOpacityIn, lapAnimation, lapAnimationContracted,
    slideAndFadeInFromLeft, slideAndFadeInFromRight, slideAndFadeOutToRight, slideAndFadeOutToLeft,
    slideAndFadeInFromLeftForCenteredObject, slideAndFadeInFromRightForCenteredObject, slideAndFadeOutToRightForCenteredObject, slideAndFadeOutToLeftForCenteredObject,
     expandToWidthThenToHeight, bounceUpAndDownLessAndLessForCenteredObject, calculateBounceUpAndDownLessAndLess } from '../../assets/Animations'

import {turnMillisecondsPretty, defaultFormatSettings} from '../../assets/TimeFormatting'

import StopwatchTimeItem from './StopwatchTimeItem'

import {useInterval} from 'usehooks-ts'

export default function Stopwatch() {

    //states
    
    const defaultStopwatchObjectEntry = {
        timeOfLastStopwatchChange: Date.now(),
        lastStoppedStopwatchTime: 0,
        lastRanStopwatchTime: Date.now(),
        lastLapStopwatchTime: 0,
        avgLapTime: 0,
        avgLapTimeWithoutStoppedTimes: 0,
        stopwatchTime: 0,
        showPrimaryAndNotSecondaryAverage: true,
        lapAndStopped: false,
        formatSettings: defaultFormatSettings,
        timeArray: []
    }
    // initialize stopwatch object with one entry and set it as current using 0 key
    const [stopwatchObject, setStopwatchObject] = useState({0: defaultStopwatchObjectEntry})
    const [currentStopwatchObjectIndex, setCurrentStopwatchObjectIndex] = useState(0)

    // these states in particular shall be collected from stopwatch object when the current index changes
    const [timeOfLastStopwatchChange, setTimeOfLastStopwatchChange] = useState(Date.now()) // Time of Last Stopwatch Change // time stamp IE 1714009411220 ms
    const [lastStoppedStopwatchTime, setLastStoppedStopwatchTime] = useState(0) // Old Stopwatch Time to record previous active time // Not timestamp IE 3000 ms
    const [lastRanStopwatchTime, setLastRanStopwatchTime] = useState(Date.now())  // timestamp
    const [lastLapStopwatchTime, setLastLapStopwatchTime] = useState(0) // Old Stopwatch Time to record previous lap time // Not timestamp IE 3000 ms
    const [avgLapTime, setAvgLapTime] = useState(0) // stored average lap time
    const [avgLapTimeWithoutStoppedTimes, setAvgLapTimeWithoutStoppedTimes] = useState(0) // stored avg lap time excluding stpped times
    const [stopwatchTime, setStopwatchTime] = useState(0) // Stopwatch Time (total time while active) // Not timestamp IE 3123 ms
    const [showPrimaryAndNotSecondaryAverage, setShowPrimaryAndNotSecondaryAverage] = useState(true)
    const [lapAndStopped, setLapAndStopped] = useState(false)
    const [formatSettings, setFormatSettings] = useState(stopwatchObject[currentStopwatchObjectIndex].formatSettings)
    

    // use effects to update object
    useEffect(() => {
        updateObjectEntry(
            stopwatchObject,
            currentStopwatchObjectIndex, 
            {
                timeOfLastStopwatchChange: timeOfLastStopwatchChange,
                lastStoppedStopwatchTime: lastStoppedStopwatchTime,
                lastRanStopwatchTime: lastRanStopwatchTime,
                lastLapStopwatchTime: lastLapStopwatchTime,
                avgLapTime: avgLapTime,
                avgLapTimeWithoutStoppedTimes: avgLapTimeWithoutStoppedTimes,
                stopwatchTime: stopwatchTime,
                showPrimaryAndNotSecondaryAverage: showPrimaryAndNotSecondaryAverage,
                lapAndStopped: lapAndStopped,
                formatSettings: formatSettings
            }
        )   
    }, [
        timeOfLastStopwatchChange, 
        lastStoppedStopwatchTime, 
        lastRanStopwatchTime, 
        lastLapStopwatchTime, 
        avgLapTime, 
        avgLapTimeWithoutStoppedTimes, 
        stopwatchTime, 
        showPrimaryAndNotSecondaryAverage, 
        lapAndStopped, 
        formatSettings
    ])
    

    // if selected index changes, update states

    useEffect(() => {
        setTimeOfLastStopwatchChange(stopwatchObject[currentStopwatchObjectIndex].timeOfLastStopwatchChange)
        setLastStoppedStopwatchTime(stopwatchObject[currentStopwatchObjectIndex].lastStoppedStopwatchTime)
        setLastRanStopwatchTime(stopwatchObject[currentStopwatchObjectIndex].lastRanStopwatchTime)
        setLastLapStopwatchTime(stopwatchObject[currentStopwatchObjectIndex].lastLapStopwatchTime)
        setAvgLapTime(stopwatchObject[currentStopwatchObjectIndex].avgLapTime)
        setAvgLapTimeWithoutStoppedTimes(stopwatchObject[currentStopwatchObjectIndex].avgLapTimeWithoutStoppedTimes)
        setStopwatchTime(stopwatchObject[currentStopwatchObjectIndex].stopwatchTime)
        setShowPrimaryAndNotSecondaryAverage(stopwatchObject[currentStopwatchObjectIndex].showPrimaryAndNotSecondaryAverage)
        setLapAndStopped(stopwatchObject[currentStopwatchObjectIndex].lapAndStopped)
        setFormatSettings(stopwatchObject[currentStopwatchObjectIndex].formatSettings)
        
        if(stopwatchObject[currentStopwatchObjectIndex].timeArray.length > 0){
            let {lastDifference, reason} = stopwatchObject[currentStopwatchObjectIndex].timeArray[stopwatchObject[currentStopwatchObjectIndex].timeArray.length - 1]
            lapNotificationElement.current.innerHTML = `+${turnMillisecondsPretty(lastDifference, stopwatchObject[currentStopwatchObjectIndex].formatSettings, true)} ${reason}`
        } else if (stopwatchObject[currentStopwatchObjectIndex].timeArray.length == 0){
            lapNotificationElement.current.innerHTML = ""
        }
        
    }, [currentStopwatchObjectIndex])

    const [useIntervalActive, setUseIntervalActive] = useState(false) // Use Interval Active State (to turn on and on recording of time difference since last activation)// true = on / false = off
  

    const [prettyTime, setPrettyTime] = useState()

    
    const lapNotificationElement = useRef(null)



    function runStopWatch() {
        setTimeOfLastStopwatchChange(Date.now()) // freshen time stamp A
            
        setLastStoppedStopwatchTime(stopwatchTime) // document old time
        
        
      
        if(stopwatchTime > 0 && useIntervalActive){addLapTimeToStopwatchArray("Stopped")}
        !useIntervalActive && setLapAndStopped(false)
        !useIntervalActive && setLastRanStopwatchTime(Date.now())
        setUseIntervalActive(!useIntervalActive) // begin updating difference in time by activating interval
    }
    useInterval(() => {
        setStopwatchTime(lastStoppedStopwatchTime + Date.now() - timeOfLastStopwatchChange)

    }, useIntervalActive ? 10 : null)
    function addLapTimeToStopwatchArray(reason) {
        setLastLapStopwatchTime(stopwatchTime)
        if(stopwatchTime === 0) return
        let alreadyContainsTimeType = ""  // initialize already contains situation
        let indexOfTimeObjectToUpdate
        
        stopwatchObject[currentStopwatchObjectIndex].timeArray.forEach((object, index) => { // for each object {time: 999, reason: 'Lap' || 'Stopped' || 'Stopped and Lap'}
            
            // for deciding reason of stop and not duplciating
            if(object.time === stopwatchTime){ // if time is the same
                if (object.reason === 'Stopped') {
                    alreadyContainsTimeType = "Stopped"; 
                    indexOfTimeObjectToUpdate = index} // already contains time of the STOPPED reason
                else if (object.reason === 'Lap' || object.reason === 'Stop + Lap') {
                    alreadyContainsTimeType = "Lap"
                } // already contains time of LAP or STOPPED AND LAP reason
            }
        }) // end for each 
    
        
        
        let situationalLastDifference
        let situationalReason
        if(alreadyContainsTimeType == "Stopped"){
            // setLastLapStopwatchTime(stopwatchTime)
            console.log("already contains stopped")
            let {lastDifference} = stopwatchObject[currentStopwatchObjectIndex].timeArray[indexOfTimeObjectToUpdate] // let lastDifference = stopwatchObject[currentStopwatchObjectIndex].timeArray[indexOfTimeObjectToUpdate].lastDifference
        
            stopwatchObject[currentStopwatchObjectIndex].timeArray.splice(indexOfTimeObjectToUpdate, 1)
            setLapAndStopped(true)
            
            situationalLastDifference = lastDifference
            situationalReason = "Stop + Lap"
        } else if (alreadyContainsTimeType == "" || reason == "Stopped"){ // if does not already contain a time type and the reason for the entry is Stopped
            // setLastStoppedStopwatchTime(stopwatchTime)
            situationalLastDifference = stopwatchTime - (lastLapStopwatchTime || 0)
            console.log(`stopwatchtime ${stopwatchTime} - lastLapStopwatchTime ${lastLapStopwatchTime} = ${situationalLastDifference}`)
            situationalReason = typeof reason == 'string' && reason || 'Lap'
        } else if (alreadyContainsTimeType == "Lap"){
            return
        }
        console.log(situationalReason)
        updateObjectEntry(
            stopwatchObject,
            currentStopwatchObjectIndex, 
            {
                timeArray: [
                    ...stopwatchObject[currentStopwatchObjectIndex].timeArray,
                    {time: stopwatchTime, lastDifference: situationalLastDifference, reason: situationalReason}
                ],
                stopwatchTime: stopwatchTime,
            }
        )

        lapNotificationElement.current.innerHTML = `+${turnMillisecondsPretty(situationalLastDifference, stopwatchObject[currentStopwatchObjectIndex].formatSettings, true)} ${situationalReason}`
        if(contracted){lapNotificationElement.current.animate(lapAnimationContracted, {duration: 800, easing: "ease"})}
        else if(!contracted){lapNotificationElement.current.animate(lapAnimation, {duration: 800, easing: "ease"})}
    }   


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

    // requires slideAndFadeOutToLeftForCenteredObject, slideAndFadeInFromRightForCenteredObject, slideAndFadeOutToRightForCenteredObject, slideAndFadeInFromLeftForCenteredObject
    function navigateToKeyFromObjectAndDisplay(destinationKey, fullObject, setCurrentKeyFunction, oldKey, element, force) {
        let aboveMaxIndex = Object.keys(fullObject).length

        if((destinationKey < aboveMaxIndex && destinationKey >= 0) || force) {
            const halfAnimationTime = 500 // for easy changing
            // decide animation behavior
            let [firstAnim, secondAnim] = []
            if(destinationKey > oldKey) { // animate to left
                [firstAnim, secondAnim] = [slideAndFadeOutToLeftForCenteredObject, slideAndFadeInFromRightForCenteredObject]
            } else if (destinationKey < oldKey) { // animate to right
                [firstAnim, secondAnim] = [slideAndFadeOutToRightForCenteredObject, slideAndFadeInFromLeftForCenteredObject]
            }
            element.animate(firstAnim, {duration: halfAnimationTime, easing: "ease-in"})
            // wait before animating second animation
            setTimeout(() => { // update current key and run second animation
                setCurrentKeyFunction(destinationKey) 
                element.animate(secondAnim, {duration: halfAnimationTime, easing: "ease-out"})
            }, halfAnimationTime)


        } else {
            console.log(`Destination index ( ${destinationKey} ) not in index range ( 0 - ${aboveMaxIndex - 1} ).`)
        }
    }
    const mainStopwatchTimeElement = useRef(null)
    useEffect(() => {
        
        if(document.querySelector(".average-lap-container.contracted")){
            document?.querySelector(".average-lap-container.contracted .average-lap-info-primary")?.animate(calculateBounceUpAndDownLessAndLess(-50, 0, -100, 20, .9, .8), {duration: 1000})
            document?.querySelector(".average-lap-container.contracted .average-lap-primary")?.animate(calculateBounceUpAndDownLessAndLess(-50, 100, -100, 20, .9, .8), {duration: 1000})
        } else {
        document?.querySelector(".average-lap-container .average-lap-info-primary")?.animate(calculateBounceUpAndDownLessAndLess(-100, 0, -100, 20, .9, .8), {duration: 1000})
        document?.querySelector(".average-lap-container .average-lap-primary")?.animate(calculateBounceUpAndDownLessAndLess(-100, 100, -100, 20, .9, .8), {duration: 1000})
    }

    }, [avgLapTime, avgLapTimeWithoutStoppedTimes])

    const [contracted, setContracted] = useState(true)
    //update pretty time if (stopwatch time || selected index || settings) change
    useEffect(() => {
        // console.log("[stopwatchTime, currentStopwatchObjectIndex, stopwatchObject[currentStopwatchObjectIndex].formatSettings, contracted] changed")
        // update pretty time
        let newPrettyTime =  turnMillisecondsPretty(stopwatchTime, stopwatchObject[currentStopwatchObjectIndex].formatSettings)
        setPrettyTime(newPrettyTime)
        if(!contracted){
            mainStopwatchTimeElement.current.style.fontSize = `calc(var(--general-size-factor-px) * 28)`
            // console.log("contracted")
        } else {
            
            // switch cases
            let caseResult = 797 * (newPrettyTime.length ** -1.03)
            switch(newPrettyTime.length) {
                case 0: case 1: case 2: case 3: case 4: {caseResult = 180; break}
                default: {caseResult = (797 * (newPrettyTime.length ** -1.03))}
            }
            mainStopwatchTimeElement.current.style.fontSize = `calc(var(--general-size-factor-px) * ${caseResult})` // 12, 62 | 11, 69 | 10, 76 | 9, 83 | 8, 94
        }
        
    }, [stopwatchTime, currentStopwatchObjectIndex, stopwatchObject[currentStopwatchObjectIndex].formatSettings, contracted])
    // update states if currentStopwatchObjectIndex changes
    

    useEffect(() => {
        let lapArray = []
        let lapArrayWithoutStopped = []
        let totalLapTime = 0
        let totalLapTimeWithoutStopped = 0
        console.log(currentStopwatchObjectIndex)
        stopwatchObject[currentStopwatchObjectIndex].timeArray.forEach((timeObject, index)=> {
            // for getting avgs
            lapArray.push(timeObject.lastDifference || 0)
            totalLapTime += timeObject.lastDifference
            if(timeObject.reason !== 'Stopped'){ // Lap || Stop + Lap
                lapArrayWithoutStopped.push(timeObject.lastDifference || 0);
                totalLapTimeWithoutStopped += timeObject.lastDifference
            }
        })
        
        console.log(lapArray)
        console.log(`avg lap time is ${totalLapTime / lapArray.length || 0}`)
        setAvgLapTime(totalLapTime / lapArray.length || 0)


        console.log(lapArrayWithoutStopped)
        console.log(`avg lap time without stopped is ${totalLapTimeWithoutStopped / lapArrayWithoutStopped.length || 0}`)
        setAvgLapTimeWithoutStoppedTimes(totalLapTimeWithoutStopped / lapArrayWithoutStopped.length || 0)

        updateObjectEntry(
            stopwatchObject, 
            currentStopwatchObjectIndex, 
            {
                avgLapTime: (totalLapTime / lapArray.length) || 0,
                avgLapTimeWithoutStoppedTimes: (totalLapTimeWithoutStopped / lapArrayWithoutStopped.length) || 0
            }
        )

    }, [stopwatchObject[currentStopwatchObjectIndex].timeArray])


    const stopwatchScrollElement = useRef()
    useEffect(() => {
      resizeEventHandler()
    }, [stopwatchScrollElement])

    onresize = resizeEventHandler

    function resizeEventHandler(event){
        setTimeout(() => {
            if(stopwatchScrollElement.current){
            console.log(stopwatchScrollElement.current.offsetWidth, stopwatchScrollElement.current.clientWidth)
            let calculatedPercentage = ((stopwatchScrollElement.current.offsetWidth - stopwatchScrollElement.current.clientWidth)/stopwatchScrollElement.current.offsetWidth)
            stopwatchScrollElement.current.style= `padding-right: ${calculatedPercentage * 130}%`
          }
        }, 1200); // to wait for animations to finish   
    }

    return (
        <div className="stopwatch-section">
            
            <h1 className="title">⏱ Stopwatch ⏱</h1>
            <div ref={stopwatchWrapper} className={`stopwatch-wrapper ${contracted ? 'stopwatch-wrapper-contracted' : ''}`}>
                <button className={`stopwatch-button expand-contract-stopwatch ${contracted ? 'expand-contract-stopwatch-contracted' : ''}`}  onClick={() => setContracted(!contracted)}></button>
                
                <div className={`stopwatch-list-container ${contracted ? 'stopwatch-list-container-contracted' : ''}`}>
                    <div ref={stopwatchScrollElement} className={`stopwatch-scroll-container ${contracted ? 'stopwatch-scroll-container-contracted' : ''}`}>
                        <ul className='stopwatch-unordered-list'>{stopwatchObject[currentStopwatchObjectIndex]?.timeArray.length > 0 && stopwatchObject[currentStopwatchObjectIndex].timeArray.map((object, index) => (
                            <StopwatchTimeItem key={index} passedKey={index} object={object}/>
                        ))}
                        </ul>
                    </div>
                </div>
                

                <div ref={mainStopwatchTimeElement} className={`main-stopwatch-time ${contracted ? 'main-stopwatch-time-contracted' : ''}`}>{prettyTime}</div>
                <div ref={lapNotificationElement} className={`lap-notification ${contracted ? 'lap-notification-contracted' : ''}`}></div>
                <div className={`stopwatch-startstop-lap-container ${contracted ? 'stopwatch-startstop-lap-container-contracted' : ''}`}>
                    <button className="stopwatch-button" onClick={(event) => {event.stopPropagation(); runStopWatch()}}>{useIntervalActive ? 'Stop' : 'Start'}</button>
                    {stopwatchTime != 0 && (!lapAndStopped ?  <button className="stopwatch-button" onClick={(event) => {event.stopPropagation(); addLapTimeToStopwatchArray("Lap")}}>Lap</button> : <div className='already-lapped'>can't lap<br/>twice</div>)}
                </div>
                <div className={`average-lap-container ${contracted ? 'contracted' : ''}`} 
                onClick={() => {setShowPrimaryAndNotSecondaryAverage(!showPrimaryAndNotSecondaryAverage)}}>
                    <div className={`${showPrimaryAndNotSecondaryAverage ? 'average-lap-info-primary' : 'average-lap-info-secondary'}`}>Average Lap</div>
                    <div className={`${showPrimaryAndNotSecondaryAverage ? 'average-lap-info-secondary' : 'average-lap-info-primary'}`}>Avg. w/o Stopped</div>
                    <div className={`${showPrimaryAndNotSecondaryAverage ? 'average-lap-primary' : 'average-lap-secondary'}`}>
                        {turnMillisecondsPretty(avgLapTime, stopwatchObject[currentStopwatchObjectIndex].formatSettings)}
                    </div>
                    <div className={`${showPrimaryAndNotSecondaryAverage ? 'average-lap-secondary' : 'average-lap-primary'}`}>
                        {turnMillisecondsPretty(avgLapTimeWithoutStoppedTimes, stopwatchObject[currentStopwatchObjectIndex].formatSettings)}
                    </div>
                </div>
                
                
            <button className={`stopwatch-button add-stopwatch-entry ${contracted ? 'add-stopwatch-entry-contracted' : ''}`} onClick={(event) => {event.stopPropagation();
            updateObjectEntry(stopwatchObject, Object.entries(stopwatchObject).length, Object.assign({}, defaultStopwatchObjectEntry, {name: `Stopwatch ${Object.entries(stopwatchObject).length}`}));
            navigateToKeyFromObjectAndDisplay(Object.entries(stopwatchObject).length, stopwatchObject, setCurrentStopwatchObjectIndex, currentStopwatchObjectIndex, stopwatchWrapper.current, true)}}
            >➕</button>
            <input className={`stopwatch-label-input ${contracted ? 'stopwatch-label-input-contracted' : ''}`} value={stopwatchObject[currentStopwatchObjectIndex].name} onChange={(event) => updateObjectEntry(stopwatchObject, currentStopwatchObjectIndex, Object.assign({}, stopwatchObject[currentStopwatchObjectIndex], {name: event.target.value}))}/>
            </div>

            {currentStopwatchObjectIndex > 0 && <button className={`stopwatch-button stopwatch-navigation stopwatch-navigation-left`} onClick={(event) => navigateToKeyFromObjectAndDisplay(currentStopwatchObjectIndex - 1, stopwatchObject, setCurrentStopwatchObjectIndex, currentStopwatchObjectIndex, stopwatchWrapper.current)}>
                <div className='stopwatch-navigation-inner-left'>&lt;</div>
            </button>}
            {currentStopwatchObjectIndex < Object.keys(stopwatchObject).length - 1 && <button className={`stopwatch-button stopwatch-navigation stopwatch-navigation-right`} onClick={(event) => navigateToKeyFromObjectAndDisplay(currentStopwatchObjectIndex + 1, stopwatchObject, setCurrentStopwatchObjectIndex, currentStopwatchObjectIndex, stopwatchWrapper.current)}>
                <div className='stopwatch-navigation-inner-right'>&gt;</div>
            </button>}

            
        </div>
    )
}