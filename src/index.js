import getConfig from './getConfig'
import fetchData from './fetchData'

getConfig().then(fetchData)
