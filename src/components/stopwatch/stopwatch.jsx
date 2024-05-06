import React, { useState } from 'react'

import { fadeOpacityIn, slideInFromLeft, slideInFromRight, slideOutToRight, slideOutToLeft, expandOutToLeftThenExpandOutToBottom } from '../../assets/Animations'


export default function Stopwatch() {

    const defaultStopwatchObjectEntry = { 
        storedTime: 0, 
        name: "Stopwatch 0",
        timeArray: [],
        avgLapTime: 0,
        avgLapTimeWithoutStoppedTimes: 0
    }
    const [stopwatchObject, setStopwatchObject] = useState({
        0: defaultStopwatchObjectEntry
    })
    const [currentStopwatchObjectIndex, setCurrentStopwatchObjectIndex] = useState(0)

    function updateObjectEntry(fullObject, entryKey, entryValue) {
        setStopwatchObject(Object.assign(
            {}, 
            fullObject, 
            {[entryKey]: entryValue}))

        console.log(fullObject)
    }

    function navigateToKeyFromObject(fullObject, currentKey, setCurrentKey, destination) {
        if(destination == 'next') {destination = currentKey + 1}
        if(destination == 'previous') {destination = currentKey - 1}
        console.log(destination)

        let aboveMaxIndex = Object.keys(fullObject).length

        if(destination < aboveMaxIndex && destination >= 0) {
            setCurrentKey(destination)
        } else {console.log("Destination out of range.")}
    }

    const [circlizedActive, setCirclizedActive] = useState(false)
    return (
        <div className="stopwatch-wrapper">
            <div className={`test-wrapper ${circlizedActive ? 'test-wrapper-altered' : ''}`} onClick={() => setCirclizedActive(!circlizedActive)}>
                <div className={`test-child ${circlizedActive ? 'test-child-altered' : ''}`}>
                    {stopwatchObject[currentStopwatchObjectIndex].storedTime}
                </div>
            </div>
            <button className={`stopwatch-button add-stopwatch-entry`} onClick={(event) => {event.stopPropagation();updateObjectEntry(stopwatchObject, Object.entries(stopwatchObject).length, Object.assign({}, defaultStopwatchObjectEntry, {name: `Stopwatch ${Object.entries(stopwatchObject).length}`}))}}
            >New</button>
            <button className={`stopwatch-button`} onClick={(event) => navigateToKeyFromObject(stopwatchObject, currentStopwatchObjectIndex, setCurrentStopwatchObjectIndex, 'previous')}>&lt;</button>
            <input className="stopwatch-title" value={stopwatchObject[currentStopwatchObjectIndex].name} onChange={(event) => updateObjectEntry(stopwatchObject, currentStopwatchObjectIndex, Object.assign({}, stopwatchObject[currentStopwatchObjectIndex], {name: event.target.value}))}/>
            <button className={`stopwatch-button`} onClick={(event) => navigateToKeyFromObject(stopwatchObject, currentStopwatchObjectIndex, setCurrentStopwatchObjectIndex, 'next')}>&gt;</button>
        </div>
    )
}