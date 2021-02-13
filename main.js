import raven from './node_modules/@dvo/raven/src/index.js'

// const qs = el => el.querySelector.bind(el)

/*
    Link Name
*/
const capTextLength = text => text.slice(0, 10)

const getEpithet = (attributes = raven.store.attributes) => {
    const { epithets } = raven.store
    const setEpithet = text => {
        document.querySelector('.charEpithet').textContent = text
    }
    let max, min

    max = Object.entries(attributes).find(pair => pair[1] >= 9)
    max && setEpithet(epithets[max[0]][0])

    !max && (min = Object.entries(attributes).find(pair => pair[1] <= 1))
    min && setEpithet(epithets[min[0]][1])

    !max && !min && setEpithet(epithets.average)
}

raven.sync('name', {
        target: document.querySelector('.charNameLabel > input'),
        prop: 'value'
    },
    capTextLength
)

raven.pull('name', {
    target: document.querySelector('.charName'),
    prop: 'textContent'
})

raven.subscribe('attributes', getEpithet)

getEpithet()
/*
    Link Attributes
*/

const listOfAttributes = [
    'strength',
    'dexterity',
    'stamina',
    'intelligence',
    'wisdom',
    'charisma'
]

const allInputs = [...document.querySelectorAll('.attr')]

listOfAttributes.forEach(attr => {
    raven.sync(`attributes.${attr}`, {
        target: document.querySelector(`.${attr}`),
        prop: 'value'
    },
    x => +x
    )
})

const redrawAttrLimits = attributes => {
    const { maxAttributes } = raven.store
    const total = Object.values(attributes)
        .map(num => +num)
        .reduce((acc, cur) => acc + cur)
    const leftOver = maxAttributes - total

    // Set max limits
    allInputs.forEach(input =>
        input.setAttribute('max',
            Math.min(10, +input.value + leftOver)
        )
    )
}

const redrawAttrClasses = () => {
    allInputs.forEach(input => {
        const { value } = input
        if (value <= 1)
            input.parentNode.classList.add('weak')
        else 
            input.parentNode.classList.remove('weak')
        
        if (value >= 9)
            input.parentNode.classList.add('strong')
        else
            input.parentNode.classList.remove('strong')
    })
}

raven.subscribe('attributes',redrawAttrLimits)
raven.subscribe('attributes',redrawAttrClasses)

/*
    Handle Point Bar
*/

const getPercent = (nom, den) => {
    return Math.floor(nom / den * 100)+ '%'
}

const redrawAttrBars = (attributes = raven.store.attributes) => {
    const {
        strength, dexterity, stamina,
        intelligence, wisdom, charisma
    } = attributes
    const { maxAttributes } = raven.store
    const physical = strength + dexterity + stamina
    const mental = intelligence + wisdom + charisma
    const unused = maxAttributes - physical - mental


    const physicalEl = document.querySelector('.physical')
    const mentalEl = document.querySelector('.mental')
    const unusedEl = document.querySelector('.unused')

    // Fix width of bars
    physicalEl.style.flex = physical / maxAttributes
    mentalEl.style.flex = mental / maxAttributes
    unusedEl.style.flex = unused / maxAttributes

    // Update Number
    physicalEl.querySelector('.counter').textContent = getPercent(physical, maxAttributes)
    mentalEl.querySelector('.counter').textContent = getPercent(mental, maxAttributes)
    unusedEl.querySelector('.counter').textContent = getPercent(unused, maxAttributes)

    // Hide obsolete
    ;[
        [physical, physicalEl],
        [mental, mentalEl],
        [unused, unusedEl]
    ].forEach(group => {
        group[0] > 5
            ? group[1].querySelector('div').classList.remove('_hidden')
            : group[1].querySelector('div').classList.add('_hidden')
    })
}

redrawAttrBars()


raven.subscribe('attributes', redrawAttrBars)