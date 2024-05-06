export const fadeOpacityIn = [{opacity: 0}, {opacity: 1}]

// export const slideInFromLeft = [{transform: 'translateX(-100%)'}, {transform: 'translateX(0)'}]

// export const slideInFromRight = [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]

// export const slideOutToRight = [{transform: 'translateX(0)'}, {transform: 'translateX(100%)'}]

// export const slideOutToLeft = [{transform: 'translateX(0)'}, {transform: 'translateX(-100%)'}]

export const slideInFromLeft = [{transform: 'translateX(-100%)', opacity: 0}, {transform: 'translateX(0)', opacity: 1}]

export const slideInFromRight = [{transform: 'translateX(100%)', opacity: 0}, {transform: 'translateX(0)', opacity: 1}]

export const slideOutToRight = [{transform: 'translateX(0)', opacity: 1}, {transform: 'translateX(100%)', opacity: 0}]

export const slideOutToLeft = [{transform: 'translateX(0)', opacity: 1}, {transform: 'translateX(-100%)', opacity: 0}]


const settingsSize = {width: "8rem", height: "14rem"}
export const expandOutToLeftThenExpandOutToBottom = [
    {
        width: '0', 
        height: '0', 
        opacity: 0, 
        visibility: 'hidden'
    }, {
        width: settingsSize.width, 
        height: '2rem', 
        opacity: 1, 
        offset: 0.3, 
        visibility: 'visible'
    }, {
        width: settingsSize.width, 
        height: settingsSize.height, 
        opacity: 1, 
        visibility: 'visible'

    }
]

