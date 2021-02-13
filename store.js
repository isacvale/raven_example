import raven from './node_modules/@dvo/raven/src/index.js'

const character = {
    name: "Doe",
    epithet: 'the Average',
    maxAttributes: 30,
    attributes: {
        strength: 2,
        dexterity: 2,
        stamina: 2,
        intelligence: 2,
        wisdom: 2,
        charisma: 2,
    },
    ratios: {
        unused: 18/30,
        physical: 6/30,
        mental: 6/30
    },
    epithets: {
        strength: ['the Strong', 'the Wimpy'],
        dexterity: ['the Quick', 'the Clot'],
        stamina: ['the Immovable', 'the Feeble'],
        intelligence: ['the Keen', 'the Oaf'],
        wisdom: ['the Judicious', 'the Fool'],
        charisma: ['the Bright', 'the Vile'],
        average: 'the Boring'
    }
}

raven.load(character)
