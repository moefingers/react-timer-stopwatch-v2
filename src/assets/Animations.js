export const fadeOpacityIn = [{opacity: 0}, {opacity: 1}]

// export const slideInFromLeft = [{transform: 'translateX(-100%)'}, {transform: 'translateX(0)'}]

// export const slideInFromRight = [{transform: 'translateX(100%)'}, {transform: 'translateX(0)'}]

// export const slideOutToRight = [{transform: 'translateX(0)'}, {transform: 'translateX(100%)'}]

// export const slideOutToLeft = [{transform: 'translateX(0)'}, {transform: 'translateX(-100%)'}]


// for non centered objects
export const slideAndFadeInFromLeft = [{transform: 'translateX(-100%)', opacity: 0}, {transform: 'translateX(0)', opacity: 1}]

export const slideAndFadeInFromRight = [{transform: 'translateX(100%)', opacity: 0}, {transform: 'translateX(0)', opacity: 1}]

export const slideAndFadeOutToRight = [{transform: 'translateX(0)', opacity: 1}, {transform: 'translateX(100%)', opacity: 0}]

export const slideAndFadeOutToLeft = [{transform: 'translateX(0)', opacity: 1}, {transform: 'translateX(-100%)', opacity: 0}]

//for centered objects

export const slideAndFadeInFromLeftForCenteredObject = [{left: '-50%', opacity: 0}, {left: '50%', opacity: 1}]

export const slideAndFadeInFromRightForCenteredObject = [{left: '100%', opacity: 0}, {left: '50%', opacity: 1}]

export const slideAndFadeOutToRightForCenteredObject = [{left: '50%', opacity: 1}, {left: '100%', opacity: 0}]

export const slideAndFadeOutToLeftForCenteredObject = [{left: '50%', opacity: 1}, {left: '-50%', opacity: 0}]


// const settingsSize = {width: "8rem", height: "14rem"}
export function expandToWidthThenToHeight(width, height) {
return [
    {
        width: '0', 
        height: '0', 
        opacity: 0, 
        visibility: 'hidden'
    }, {
        width: width, 
        height: '2rem', 
        opacity: 1, 
        offset: 0.3, 
        visibility: 'visible'
    }, {
        width: width, 
        height: height, 
        opacity: 1, 
        visibility: 'visible'

    }
]

}
