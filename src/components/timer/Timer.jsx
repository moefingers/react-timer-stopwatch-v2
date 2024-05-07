import React, { useState, useRef} from 'react'
import {useInterval} from 'usehooks-ts'

export default function Timer() {
    
    const [useIntervalActive, setUseIntervalActive] = useState(false)


    const timerWrapper = useRef(null)
    const [contracted, setContracted] = useState(false)
    return (
        
        <div className="timer-section">
            <h1 className="title">⏲ Timer ⏲</h1>
            <div ref={timerWrapper} className={`timer-wrapper ${contracted ? 'timer-wrapper-contracted' : ''}`}>
                <div className="hour-glass-background"></div>
                <button className={`timer-button expand-contract-timer ${contracted ? 'expand-contract-timer-contracted' : ''}`}  onClick={() => setContracted(!contracted)}>{contracted ? '➕' : '➖'}</button>
                <div className={`test-child ${contracted ? 'test-child-altered' : ''}`}>
                    400055
                </div>
                <div className={`timer-startstop-lap-container ${contracted ? 'timer-startstop-lap-container-contracted' : ''}`}>
                    <button className="timer-button" onClick={(event) => {event.stopPropagation()}}>{useIntervalActive ? 'Stop' : 'Start'}</button>
                    <button className="timer-button" onClick={(event) => {event.stopPropagation()}}>button</button>
                </div>
            </div>

        </div>
    )
}