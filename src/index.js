const { ApolloServer, gql } = require('apollo-server');
const Bind = require('./Bind.js')

const config = require('../config.json')

const typeDefs = gql`

enum Language {
    ${Object.keys(config.languages)}
}

type Query {
    run(code: String!, lang: Language!): String!
}

`

const binds = new Map()

for(const [lang, params] of Object.entries(config.languages)) {
    binds.set(lang, new Bind(config, params))
}

console.log(`=> Loaded config`);
const resolvers = {
    Query: {
        async run(parent, args, context, info) {
            const {lang, code} = args

            const bind = binds.get(lang)
            if(!bind) return new Error('Language is not specified in config.')

            return await bind.run(code)
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({port: config.port, host: config.host}).then(({ url }) => {
  console.log(`=> Server ready at ${url}`);
});
