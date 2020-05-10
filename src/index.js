const { ApolloServer, gql } = require('apollo-server');
const http = require('http');

const Bind = require('./Bind.js')

const config = require('../config.json')

const typeDefs = gql`

enum Language {
    ${config.languages.map(l=>l.name)}
}

type Query {
    run(code: String!, lang: Language!): String!
}

`

const binds = new Map()

for(lang of config.languages) {
    binds.set(lang.name, new Bind(config, lang))
}

console.log(`=> Loaded config`);
const resolvers = {
    Query: {
        async run(parent, args, context, info) {
            const {lang, code} = args

            const bind = binds.get(lang)
            if(!bind) return new Error('Bad lang')

            return await bind.run(code)
        }
    }
}

const restServer = http.createServer(async (req, res) => {
    const args = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const code = args.get('code')
    const lang = args.get('lang')
    if(!code) {
        res.writeHead(400, { 'Content-Type': 'text/json' })
        return res.end(JSON.stringify({code: 400, message: "Missing code"}))
    }
    if(!lang) {
        res.writeHead(400, { 'Content-Type': 'text/json' })
        return res.end(JSON.stringify({code: 400, message: "Missing lang"}))
    }
    console.log(lang)
    const bind = binds.get(lang)
    if(!bind)  {
        res.writeHead(400, { 'Content-Type': 'text/json' })
        return res.end(JSON.stringify({code: 400, message: "Bad lang"}))
    }

    const result = await bind.run(code)
    res.writeHead(200, {'Content-Type': 'text/json'})
    return res.end(JSON.stringify({code: 200, data: result}))
});

const server = new ApolloServer({ typeDefs, resolvers });

restServer.listen(config.rest.port, config.rest.host, ()=>{
    console.log(`=> REST Server ready at http://${config.rest.host}:${config.rest.port}`)
});

server.listen({port: config.graphql.port, host: config.graphql.host}).then(({ url }) => {
  console.log(`=> GraphQL Server ready at ${url}`);
});
