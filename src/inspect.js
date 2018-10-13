import inquirer from 'inquirer'
import { readdir } from 'fs'

import { inspect, logEmptyLine } from './utils'

const selectFile = () =>
	new Promise(resolve =>
		readdir('./output', (err, files) => {
			const jsonFiles = files.filter(file => file.slice(-5) === '.json')

			if (!jsonFiles.length) {
				console.log('🛑  No json files found in the output directory')
				process.exit()
			}

			return jsonFiles.length > 1
				? inquirer
						.prompt([
							{
								type: 'list',
								name: 'fileName',
								message: 'Select a file:',
								choices: jsonFiles,
							},
						])
						.then(resolve)
				: resolve({ fileName: jsonFiles[0] })
		}),
	)

const renderOutput = ({ fileName }) => {
	const posts = require(`../output/${fileName}`)

	logEmptyLine()
	console.log(inspect(posts.reduce((a, b) => Object.assign(a, b), {})))
}

selectFile().then(renderOutput)
