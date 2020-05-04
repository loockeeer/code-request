const { ApolloServer, gql } = require('apollo-server');
const fs = require('fs')
const typedefs = gql`${fs.readFileSync("./typedefs.gql")}`

const config = require('./config.json')

const runners = {}

for(const [lang, runner] of config.languages) {
    runners[lang] = require(runner)
}
console.log(`=> Loaded config`);

const resolvers = {
    Query: {
        async run(parent, args, context, info) {
            const {language, code} = args

            const runner = runners[language]
            if(!runner) return new Error('Language is not specified in config.')

            return await runner(code)
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen({port: config.port, host: config.host}).then(({ url }) => {
  console.log(`=> Server ready at ${url}`);
});
