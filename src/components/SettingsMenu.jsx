import { useEffect, useRef, useState } from "react"


export default function SettingsMenu({currentObjectIndex, currentObjectSettings, updateObjectEntry}) {

    /*currentObjectSettings = {
        units: {
            hours: false,
            minutes: true,
            seconds: true,
        },
        decimalPlaces: 3
    }*/

    function updateSettingsObject(object) {
        updateStopwatchObject(currentObjectIndex, object)
    }
    
    // maybe use states?
    const [settingsObject, setSettingsObject] = useState(currentObjectSettings)
    useEffect(() => {
        
    }, [settingsObject])

    return (
        <div className='timer-settings' >
            <p>units</p>
            <ul>
                <li>Color picker</li>
                {Object.keys(settingsObject.units).map((unit, index) => (
                    <li key={index}>
                        {unit}
                    </li>
                ))}
            </ul>
        </div>
    )
}