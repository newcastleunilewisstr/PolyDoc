import fleekStorage from '@fleekhq/fleek-storage-js'

//const fleek = require('@fleekhq/fleek-atorage-js')
const apiKey = 'pzaHwEP9Rg1hJK/7EIC4cQ=='
const apiSecret = '1+v2cbHSDvvLRd44r8aI55HdxoKl2/jeZhSJgpO9Eb0='
const key = process.argv[2]

const GetFleekAdmin = async () => {
const input = {
	apiKey,
	apiSecret,
	key,
	getOptions: ['data']
}

try {
	const result = await fleekStorage.get(input)
	console.log(result)
}   catch(e) {
	console.log('error', e)
}
}

GetFleekAdmin();