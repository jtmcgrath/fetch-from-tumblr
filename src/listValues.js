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
	const mergedPosts = posts.reduce((a, b) => Object.assign(a, b), {})
	const fields = Object.keys(mergedPosts)

	const { field } = await inquirer.prompt([
		{
			type: 'list',
			name: 'field',
			message: 'Select a field:',
			choices: fields,
		},
	])

	let mergeChildren
	if (Array.isArray(mergedPosts[field])) {
		const res = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'mergeChildren',
				message: 'Compare child values?',
			},
		])
		mergeChildren = res.mergeChildren
	}

	const values = posts.reduce(
		(set, post) =>
			mergeChildren ? set.add(...post[field]) : set.add(post[field]),
		new Set(),
	)

	logEmptyLine()

	if (!values.size) {
		console.log(`No values were found for the field "${field}"`)
	}

	console.log(`Found ${values.size} values for the field "${field}":`)
	logEmptyLine()
	console.log(JSON.stringify(values, null, 2))
	logEmptyLine()
})
