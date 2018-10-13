import inquirer from 'inquirer'
import { readdir } from 'fs'

import { inspect, logEmptyLine } from './utils'

readdir('./output', (err, files) => {
	const jsonFiles = files.filter(file => file.slice(-5) === '.json')

	if (!jsonFiles.length) {
		console.log('🛑  No json files found in the output directory')
		process.exit()
	}

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'fileName',
				message: 'Select a file:',
				choices: jsonFiles,
			},
		])
		.then(({ fileName }) => {
			const posts = require(`../output/${fileName}`)

			logEmptyLine()
			console.log(inspect(posts.reduce((a, b) => Object.assign(a, b), {})))
		})
})
