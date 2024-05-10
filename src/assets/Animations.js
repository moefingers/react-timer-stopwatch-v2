export const fadeOpacityIn = [{opacity: 0, visibility: 'hidden'}, {opacity: 1, visibility: 'visible'}]

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


export const lapAnimationContracted = [
    {
        transform: 'translate(-50%, -50%)', 
        top: "50%", 
        left: "50%", 
        opacity: 1, 
        fontSize: "calc(var(--general-size-factor-px) * 80)"
    }, {
        opacity: 1
    }, {
        transform: 'translate(-50%, -50%)', 
        opacity: 0.3, 
        fontSize: "calc(var(--general-size-factor-px) * 30)"
    }
]

export const lapAnimation = [
    {
        transform: 'translate(0%, -50%)', 
        top: "86%", 
        opacity: 1, 
        fontSize: "calc(var(--general-size-factor-px) * 28)"
    }, {
        opacity: 1
    }, {
        transform: 'translate(0%, -50%)', 
        opacity: 0, 
        fontSize: "calc(var(--general-size-factor-px) * 24)"
    }
]

export function calculateBounceUpAndDownLessAndLess(xOrigin, yOrigin, initialHeightOffeset, bounces, bounceDurationDecay, bounceHeightDecay) {
    const bounceUpAndDown = []
    let initialPercentage = 0

    // get factor to divide each time by to get them to all add up to 100  ... to100Factor
    let totalTimeFactors = 0
    for (let count = 1; count <= bounces+1; count++) {
        let timeFactor = (1 * (bounceDurationDecay ** count))
        totalTimeFactors += timeFactor
    }
    // console.log("totalTimeFactors", totalTimeFactors)
    let to100Factor = totalTimeFactors / 100

    bounceUpAndDown.push( // first location
        {transform: `translate(${xOrigin}%, ${yOrigin}%)`, offset: `${0}`}
    )
    // bounces 
    let accumulatedPercent = 0
    for (let count = 1; count <= bounces; count++) {
        // time percent to offset for each bounce
        let timeFactor = (1 * (bounceDurationDecay ** count))
        let percentage = (timeFactor / to100Factor)
        accumulatedPercent += percentage
        
        let heightFactor = (1 * (bounceHeightDecay ** count))
        let bounceHeight = initialHeightOffeset * heightFactor

        bounceUpAndDown.push(
            {transform: `translate(${xOrigin}%, ${yOrigin + bounceHeight}%)`, 
            offset: `${accumulatedPercent/100 <= 1 ? accumulatedPercent/100 : 1}`,
            easing: "ease-in",
        },
        )
        bounceUpAndDown.push(
            {
                transform: `translate(${xOrigin}%, ${yOrigin}%)`, 
                offset: `${((accumulatedPercent + percentage/2)/100 <= 1) ? (accumulatedPercent + percentage/2)/100 : 1}`,
                easing: "ease-out"
            },
        )
    }
    // console.log(bounceUpAndDown)
    // console.log(bounceUpAndDown)
    return bounceUpAndDown
}

export const bounceUpAndDownLessAndLessForCenteredObject = calculateBounceUpAndDownLessAndLess(-50, -50, -100, 100, .9, .8)


export function travelOneCircle(circleRadius, offsetStart, offsetEnd) {

    return [
        {
        offsetDistance: offsetStart,
        offsetPath: `circle(${circleRadius} at 50% 50%)`,
        },
        {
        offsetDistance: offsetEnd,
        offsetPath: `circle(${circleRadius} at 50% 50%)`,
        }
    ]
}

export function spinAndFadeInFromRadiusToRadiusAtOffset(spinDeg, radStart, radEnd, offsetStart, offsetEnd) {

    return [
        {
        transform: `rotate(${- 90 - (360 * (offsetStart / 100))}deg)`,
        offsetDistance: `${offsetStart}%`,
        offsetPath: `circle(${radStart}% at 50% 50%)`,
        },
        {
        transform: `rotate(${- 90 - spinDeg - (360 * (offsetStart / 100))}deg)`,
        offsetDistance: `${offsetEnd}%`,
        offsetPath: `circle(${radEnd}% at 50% 50%)`,
        }
    ]
}