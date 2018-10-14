import inquirer from 'inquirer'
import { readdir } from 'fs'

import { inspect, logEmptyLine } from './utils'

readdir('./output', async (err, files) => {
	const jsonFiles = files.filter(file => file.slice(-5) === '.json')

	if (!jsonFiles.length) {
		console.log('🛑  No json files found in the output directory')
		process.exit()
	}

	const { fileName } =
		jsonFiles.length > 1
			? await inquirer.prompt([
					{
						type: 'list',
						name: 'fileName',
						message: 'Select a file:',
						choices: jsonFiles,
					},
			  ])
			: { fileName: jsonFiles[0] }

	const posts = require(`../output/${fileName}`)

	logEmptyLine()
	console.log(inspect(posts.reduce((a, b) => Object.assign(a, b), {})))
	logEmptyLine()
})
