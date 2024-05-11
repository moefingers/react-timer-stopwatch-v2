
import { useEffect, useRef, useState } from 'react'

import { fadeOpacityIn, slideAndFadeInFromLeft } from '../../assets/Animations'


import {turnMillisecondsPretty, defaultFormatSettings} from '../../assets/TimeFormatting'

export default function StopwatchTimeItem(props){
    const {
        timeObject,
        timeObject: {
            time,
            lastDifference,
            reason
        },
        passedKey,
        settingsObject,
        deleteTimeItem,
        currentStopwatchObjectIndex,
    } = props

    // confirm del
    const [timeItemConfirmDelete, setTimeItemConfirmDelete] = useState(false)
    function confirmDelete() {
        if (!timeItemConfirmDelete) {
            setTimeItemConfirmDelete(true)
        } else if (timeItemConfirmDelete) {
            deleteTimeItem(currentStopwatchObjectIndex, timeObject)
        }
    }

    const stopwatchItemElement = useRef()

    useEffect(() => {
        stopwatchItemElement.current.animate(slideAndFadeInFromLeft, {duration: 500})
        setTimeout(() => {
            stopwatchItemElement?.current?.scrollIntoViewIfNeeded({behavior: "smooth"})
            document.querySelector(`#root`).scrollIntoViewIfNeeded({behavior: "smooth"})
        }, 250);
    }, [])
    return (
        <li 
        id={"li-" + passedKey} ref={stopwatchItemElement} className={`
        stopwatch-time-item
        ${reason === 'Stopped' ? 'text-shadow-blue'
        : reason === 'Lap' ? 'text-shadow-cyan' 
        : 'text-shadow-green'}
        `}>
            {turnMillisecondsPretty(time, settingsObject)}(-{turnMillisecondsPretty(lastDifference, settingsObject)})
            <span className='stopwatch-time-reason'> - {reason}</span>
            <span className="stopwatch-button delete-stopwatch-time" onClick={confirmDelete} onMouseLeave={() => {setTimeItemConfirmDelete(false)}}>{timeItemConfirmDelete ? "❌" : "✖"}</span>    
        </li>
    )
}