import { useEffect, useRef, useState } from "react"

import { spinAndFadeInFromRadiusToRadiusAtOffset } from "../assets/Animations"

import { unitInformationObject } from "../assets/TimeFormatting"


export default function SettingsMenu({setFormatSettingsState, formatSettingsState, stopwatchObject, currentStopwatchObjectIndex, updateObjectEntry, version, settingsOpen, contracted}) {
    const settingsContainerElement = useRef()
    const decimalInputElement = useRef()
    /* Example of what i have saved elsewhere
    currentObjectSettings = {
        units: {
            hours: false,
            minutes: true,
            seconds: true,
        },
        decimalPlaces: 3
    }*/

    function updateUnitSettingsObject(singleUnitObject, decimalPlaces) {

        let newFormatSettingsWithUnits = Object.assign(
            {}, 
            formatSettingsState,
            {
                units: Object.assign(
                    {}, 
                    formatSettingsState.units, // old units 
                    singleUnitObject // new unit, units IE {hours: true}
                )
            }
        )

        

        let newFormatSettings = Object.assign(
            {},
            newFormatSettingsWithUnits,
            {decimalPlaces: validateDecimalPlaces(decimalPlaces || decimalInputElement.current.value, newFormatSettingsWithUnits)}
        )
        setFormatSettingsState(newFormatSettings)
    }

    function toggleUnit(key) {
        updateUnitSettingsObject({[key]: !stopwatchObject[currentStopwatchObjectIndex].formatSettings.units[key]})
    }
    function validateDecimalPlaces(newDecimalPlaces, formatSettings) {
        console.log(`${getMaxDecimals(formatSettings)} max decimals`)
        console.log(newDecimalPlaces)
        console.log(`doesnt = "" : ${newDecimalPlaces != ""}`)
        console.log(`!Number : ${!Number(newDecimalPlaces)}`)
        console.log(`to number: ${Number(newDecimalPlaces)}`)
        console.log(`less than 0: ${Number(newDecimalPlaces) < 0}`)
        console.log(`exceeds max decimals? ${newDecimalPlaces > getMaxDecimals(formatSettings)}`)
        if(
            newDecimalPlaces != "" && (
                newDecimalPlaces > getMaxDecimals(formatSettings) 
                || (!Number(newDecimalPlaces) && Number(newDecimalPlaces) != 0) 
                || Number(newDecimalPlaces) < 0
                || newDecimalPlaces.includes(".")
            )
        ){
                newDecimalPlaces = getMaxDecimals(formatSettings)
                console.log("borken input, setting decimal places to ", newDecimalPlaces)
                decimalInputElement.current.value = newDecimalPlaces
        }
        while(newDecimalPlaces.length > 1 && newDecimalPlaces[0] == "0"){
            newDecimalPlaces = newDecimalPlaces.slice(1)
        }

        // setFormatSettingsState(
        //     Object.assign(
        //         {}, 
        //         formatSettingsState,
        //         {decimalPlaces: newDecimalPlaces}
        //     ),
        // )
        return newDecimalPlaces
    }
    function getMaxDecimals(formatSettings){
        let maxDecimals = 0
        Object.keys(formatSettings.units).forEach((key) => {
            if (formatSettings.units[key]) {
                maxDecimals = unitInformationObject[key].maxDecimals
            }
        })
        return maxDecimals
    }



    useEffect(() => {
        if(settingsOpen) { 
            if (contracted) {  //tried opening settings while stopwatch contracted
                console.log("opening settings while contracted")
                let initialDelay = 400
                let delay = (1000 - initialDelay) / (Object.keys(settingsContainerElement.current.children).length )
                Object.keys(settingsContainerElement.current.children).forEach((key, index) => {
    
                    let offset = (24 / (Object.keys(settingsContainerElement.current.children).length - 1)) * (index) // to fix off by one
                    console.log(initialDelay + (delay * index))
                    async function hideWaitAndShow() {
                        console.log("hi")
                        settingsContainerElement.current.children[key].style.display = "none"
                        await new Promise(r => setTimeout(r, initialDelay + (delay * index)));
                        settingsContainerElement.current.children[key].style.display = "unset"
                    }
                    hideWaitAndShow()
                    settingsContainerElement.current.children[key].animate(
                            spinAndFadeInFromRadiusToRadiusAtOffset(360, 55, 43, 12 + offset, 12 + offset
                        ), {duration: 1000, delay:(initialDelay + (delay * index)), easing: "ease-out", fill: "forwards"}
                    );
                })
            } else if (!contracted) { // tried opening settings while stopwatch is expanded list mode
                // how many buttons per section in expanded state? 
                let buttonsPerSection = 2
                let circularSpace = 20
                let verticalSpace = 20
                Object.keys(settingsContainerElement.current.children).forEach((key, index) => {
                    

                    let setsOfThree = (Math.floor(Object.keys(settingsContainerElement.current.children).length / buttonsPerSection) + 1)
                    let offsetDividers = (circularSpace / setsOfThree)
                    
                    let circularOffset = Math.floor(index / buttonsPerSection) * offsetDividers
                    console.log(circularOffset)
                    let verticalOffset = Math.floor(index % buttonsPerSection) * (verticalSpace / buttonsPerSection)
                    console.log(verticalOffset)
                    settingsContainerElement.current.children[key].animate(
                        [
                            {
                                transform: `rotate(${- 90 - 360 - (360 * ((32) / 100))}deg)`,
                                offsetDistance: `${32}%`,
                                offsetPath: `circle(${45}% at 50% 50%)`
                                },
                            {
                            transform: `rotate(${- 90 - 360 - (360 * ((20 + circularOffset) / 100))}deg)`,
                            offsetDistance: `${20 + circularOffset}%`,
                            offsetPath: `circle(${35 + verticalOffset}% at 50% 50%)`,
                            }
                        ]
                        , {duration: 1000, easing: "ease-out", fill: "forwards"}
                    );
                })
                
            }
        } else if (!settingsOpen) { 
            if (contracted) {// tried shutting settings while stopwatch is contracted round mode
                let initialDelay = 400
                let delay = (1000 - initialDelay) / (Object.keys(settingsContainerElement.current.children).length )
                Object.keys(settingsContainerElement.current.children).forEach((key, index) => {
    
                    let offset = (24 / (Object.keys(settingsContainerElement.current.children).length - 1)) * (index) // to fix off by one
                    console.log(initialDelay + (delay * index))
                    settingsContainerElement.current.children[key].animate(
                            spinAndFadeInFromRadiusToRadiusAtOffset(360, 55, 43, 12 + offset, 12 + offset
                        ), {duration: 1000, delay:(initialDelay + (delay * index)), easing: "ease-out", fill: "forwards", direction: "reverse"}
                    );
                })
            } else if (!contracted) { // tried shutting settings while stopwatch is expanded list mode
                
                Object.keys(settingsContainerElement.current.children).forEach((key, index) => {
                    
                    settingsContainerElement.current.children[key].animate(
                        [
                            {},
                            {
                            transform: `rotate(${- 90 - 360 - (360 * ((32) / 100))}deg)`,
                            offsetDistance: `${32}%`,
                            offsetPath: `circle(${45}% at 50% 50%)`
                            }
                        ]
                        , {duration: 1000, easing: "ease-out", fill: "forwards"}
                    );
                })
            }
        }
        
        
    }, [settingsOpen])

    useEffect(() => {

        // generate expanded key state
        let expandedElementKeyFrames = []
        let buttonsPerSection = 2
        let circularSpace = 20
        let verticalSpace = 20
        Object.keys(settingsContainerElement.current.children).forEach((key, index) => {
            

            let setsOfThree = (Math.floor(Object.keys(settingsContainerElement.current.children).length / buttonsPerSection) + 1)
            let offsetDividers = (circularSpace / setsOfThree)
            
            let circularOffset = Math.floor(index / buttonsPerSection) * offsetDividers
            console.log(circularOffset)
            let verticalOffset = Math.floor(index % buttonsPerSection) * (verticalSpace / buttonsPerSection)
            console.log(verticalOffset)
            
                    expandedElementKeyFrames.push({
                    transform: `rotate(${- 90 - 360 - (360 * ((20 + circularOffset) / 100))}deg)`,
                    offsetDistance: `${20 + circularOffset}%`,
                    offsetPath: `circle(${35 + verticalOffset}% at 50% 50%)`,
                    })
                
        })


            // end
        if(contracted && settingsOpen) { // tried shrinking to round mode while settings are open
            Object.keys(settingsContainerElement.current.children).forEach((key, index) => {

                let offset = (24 / (Object.keys(settingsContainerElement.current.children).length - 1)) * (index) // to fix off by one
                
                settingsContainerElement.current.children[key].animate(
                        
                        [
                            expandedElementKeyFrames[index],
                            {
                            transform: `rotate(${- 90 - 360 - (360 * ((12 + offset) / 100))}deg)`,
                            offsetDistance: `${12 + offset}%`,
                            offsetPath: `circle(${43}% at 50% 50%)`,
                            }
                        ]
                        , {duration: 1000, easing: "ease-out", fill: "forwards"}
                );
            })
        } else if (!contracted && settingsOpen) { // tried expanding to list mode while settings are open
            moveSettingsToExpandedMode()
        }
    }, [contracted])

    function moveSettingsToExpandedMode(){
        // how many buttons per section in expanded state? 
        let buttonsPerSection = 2
        let circularSpace = 20
        let verticalSpace = 20
        Object.keys(settingsContainerElement.current.children).forEach((key, index) => {
            

            let setsOfThree = (Math.floor(Object.keys(settingsContainerElement.current.children).length / buttonsPerSection) + 1)
            let offsetDividers = (circularSpace / setsOfThree)
            
            let circularOffset = Math.floor(index / buttonsPerSection) * offsetDividers
            console.log(circularOffset)
            let verticalOffset = Math.floor(index % buttonsPerSection) * (verticalSpace / buttonsPerSection)
            console.log(verticalOffset)
            settingsContainerElement.current.children[key].animate(
                [
                    {},
                    {
                    transform: `rotate(${- 90 - 360 - (360 * ((20 + circularOffset) / 100))}deg)`,
                    offsetDistance: `${20 + circularOffset}%`,
                    offsetPath: `circle(${35 + verticalOffset}% at 50% 50%)`,
                    }
                ]
                , {duration: 1000, easing: "ease-out", fill: "forwards"}
            );
        })
    }

    return (
        <div ref={settingsContainerElement} className={`settings-container stopwatch ${settingsOpen ? 'settings-open' : ''}`} >
            <button className="stopwatch-button open-colors-button">
                <svg version="1.1" id="Layer_1" viewBox="0 0 100 100">
                    <path id="Palette_1_" d="M84.71,80.953c-0.169-4.002-6.185-15.902-6.043-20.52c0.162-5.236,3.329-11.685,9.923,0.922  c3.951,7.555,10.016,2.854,10.752-0.822c2.223-11.12-1.078-24.458-11.591-37.527C69.567,0.405,37.605-5.802,16.38,9.144  C-4.844,24.092-5.271,57.752,14.097,77.26c17.555,17.676,41.765,25.445,62.007,16.926C78.197,93.301,85.123,90.59,84.71,80.953z   M27.852,15.419c3.83-2.697,9.12-1.78,11.819,2.052c2.699,3.831,1.779,9.122-2.051,11.819c-3.833,2.699-9.122,1.78-11.821-2.051  C23.1,23.408,24.018,18.119,27.852,15.419z M11.314,49.892c-2.697-3.831-1.777-9.122,2.053-11.819  c3.828-2.697,9.122-1.782,11.819,2.049c2.699,3.832,1.777,9.124-2.051,11.821C19.305,54.641,14.012,53.727,11.314,49.892z   M52.489,27.813c-2.701-3.831-1.781-9.124,2.051-11.821c3.831-2.697,9.12-1.779,11.821,2.053c2.697,3.83,1.778,9.12-2.053,11.819  C60.477,32.562,55.187,31.645,52.489,27.813z M23.794,71.543c-2.697-3.834-1.78-9.127,2.05-11.824  c3.831-2.697,9.124-1.779,11.821,2.051c2.697,3.832,1.78,9.125-2.051,11.822C31.784,76.291,26.492,75.371,23.794,71.543z"/>
                </svg>
            </button>
            <div className="decimal-settings-input-container stopwatch">
                <div className="tooltip">decimal places</div>
                <input ref={decimalInputElement}className='decimal-settings-input stopwatch'type="numeric" min={0} max={getMaxDecimals(formatSettingsState)} defaultValue={stopwatchObject[currentStopwatchObjectIndex].formatSettings.decimalPlaces} onChange={(e) => {console.log(e.target.value);updateUnitSettingsObject({}, e.target.value)}}/>
            </div>
            {Object.keys(formatSettingsState.units).map((unit, index) => (
                <button key={index} className={`stopwatch-button ${stopwatchObject[currentStopwatchObjectIndex].formatSettings.units[unit] ? 'setting-active' : ''}`} onClick={() => {toggleUnit(unit)}}>
                    {unitInformationObject[unit].alias}
                </button>
            ))}
        </div>
    )
}