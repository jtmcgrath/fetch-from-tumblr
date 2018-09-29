import inquirer from 'inquirer'
import { isStringWithLength } from './utils'

export default function getConfig() {
    let savedConfig
    try {
        savedConfig = require('../config').default
    } catch (e) {
        savedConfig = {}
    }

    return inquirer
        .prompt([
            {
                type: 'confirm',
                name: 'useSavedUsername',
                message: `Use saved username (${savedConfig.username})?`,
                when: () => Boolean(savedConfig.username),
            },
            {
                type: 'input',
                name: 'username',
                message: 'Tumblr Username:',
                validate: isStringWithLength,
                when: ({ useSavedUsername }) => !useSavedUsername,
            },
            {
                type: 'confirm',
                name: 'useSavedKey',
                message: 'Use saved API key?',
                when: () => Boolean(savedConfig.key)
            },
            {
                type: 'input',
                name: 'key',
                message: 'Tumblr API Key:',
                validate: isStringWithLength,
                when: ({ useSavedKey }) => !useSavedKey,
            }
        ])
        .then(inputConfig => Object.assign({}, savedConfig, inputConfig))
}