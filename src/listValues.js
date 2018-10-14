import inquirer from 'inquirer'
import { readdir } from 'fs'

import { logEmptyLine } from './utils'

readdir('./output', async (err, files) => {
	const jsonFiles = files.filter(file => file.slice(-5) === '.json')

	if (!jsonFiles.length) {
		console.log('🛑  No json files found in the output directory')
		process.exit()
	}

	const { fileName } =
		jsonFiles.length > 1
			? await inquirer
					.prompt([
						{
							type: 'list',
							name: 'fileName',
							message: 'Select a file:',
							choices: jsonFiles,
						},
					])
			: { fileName: jsonFiles[0] }

	const posts = require(`../output/${fileName}`)
	const fields = Object.keys(posts.reduce((a, b) => Object.assign(a, b), {}))

	const { field } = await inquirer.prompt([
		{
			type: 'list',
			name: 'field',
			message: 'Select a field:',
			choices: fields,
		},
	])

	const values = posts.reduce((set, post) => set.add(post[field]), new Set())

	logEmptyLine()

	if (!values.size) {
		console.log(`No values were found for the field "${field}"`)
	}

	console.log(`Found ${values.size} values for the field "${field}":`)
	logEmptyLine()
	console.log(JSON.stringify(values, null, 2))
	logEmptyLine()
})
