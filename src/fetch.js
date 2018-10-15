import inquirer from 'inquirer'
import ora from 'ora'
import { readdir, writeFile } from 'fs'

import {
	createFetchQuery,
	createFilename,
	getPageCount,
	isStringWithLength,
	logEmptyLine,
} from './utils'

;(async function() {
    let savedConfig
	try {
        savedConfig = require('../config').default
	} catch (e) {
        savedConfig = {}
	}
    
    const configQuestions = [
        {
            type: 'confirm',
            name: 'useSavedUsername',
            message: `Use saved username (${savedConfig.username})?`,
            when: () => Boolean(savedConfig.username),
        },
        {
            type: 'input',
            name: 'username',
            message: 'Tumblr username:',
            validate: isStringWithLength,
            when: ({ useSavedUsername }) => !useSavedUsername,
        },
        {
            type: 'confirm',
            name: 'useSavedKey',
            message: 'Use saved API key?',
            when: () => Boolean(savedConfig.key),
        },
        {
            type: 'input',
            name: 'key',
            message: 'Tumblr API key:',
            validate: isStringWithLength,
            when: ({ useSavedKey }) => !useSavedKey,
        },
    ]
    
    const fetchQuestions = [
        {
            type: 'confirm',
            name: 'fetchAllPosts',
            message: 'Fetch all posts?',
        },
        {
            type: 'confirm',
            name: 'fetchAllTypes',
            message: 'Fetch all post types?',
        },
        {
            type: 'list',
            name: 'type',
            message: 'Type:',
            choices: [
                'photo',
                'answer',
                'text',
                'quote',
                'link',
                'chat',
                'video',
                'audio',
            ],
            when: ({ fetchAllTypes }) => !fetchAllTypes,
        },
        {
            type: 'confirm',
            name: 'fetchAllTags',
            message: 'Fetch all tags?',
        },
        {
            type: 'text',
            name: 'tag',
            message: 'Tag:',
            when: ({ fetchAllTags }) => !fetchAllTags,
        },
    ]

    const fetchQuery = await inquirer
		.prompt(configQuestions)
		.then(inputConfig => Object.assign({}, savedConfig, inputConfig))
		.then(createFetchQuery)

	const { fetchAllPosts, type, tag } = await inquirer.prompt(fetchQuestions)

	logEmptyLine()

	const filename = createFilename({ type, tag }, fetchAllPosts)
	const fetchPage = offset => fetchQuery({ type, tag, offset })

	let totalPosts
	let offset = 0
	const postsPerPage = 20
	const posts = []
	const ui = ora()

	do {
		ui.start(`Fetching page ${getPageCount(offset, totalPosts)}`)
		const response = await fetchPage(offset)

		ui.start('Parsing response')
		const json = await response.json()

		totalPosts = json.response.total_posts || 0

		if (json.response.posts) {
			posts.push(...json.response.posts)
		}

		ui.succeed(`Fetched page ${getPageCount(offset, totalPosts)}`)
		offset = offset + postsPerPage
	} while (fetchAllPosts && offset < totalPosts)

	logEmptyLine()
	ui.start('Saving file')
	writeFile(filename, JSON.stringify(posts, null, 2), err => {
		if (err) {
			throw err
		}
		ui.succeed(`Saved response as ${filename}`)
	})
})()
