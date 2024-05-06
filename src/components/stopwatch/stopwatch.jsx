import React, { useState, useRef } from 'react'

import { fadeOpacityIn, slideAndFadeInFromLeft, slideAndFadeInFromRight, slideAndFadeOutToRight, slideAndFadeOutToLeft, expandToWidthThenToHeight } from '../../assets/Animations'

import {turnMillisecondsPretty, defaultFormatSettings} from '../../assets/TimeFormatting'

export default function Stopwatch() {

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

    function updateObjectEntry(fullObject, entryKey, entryValue) {
        let updatedObject = Object.assign(
            {}, 
            fullObject, 
            {[entryKey]: entryValue}
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
                    {stopwatchObject[currentStopwatchObjectIndex].storedTime}
                </div>
                <div className={`stopwatch-startstop-lap-container ${contracted ? 'stopwatch-startstop-lap-container-contracted' : ''}`}>
                    <button className="stopwatch-button">Start</button>
                    <button className="stopwatch-button">Lap</button>
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