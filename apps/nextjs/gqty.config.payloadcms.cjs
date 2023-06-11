/** @type {import("@gqty/cli").GQtyConfig} */
const config = {
  enumsAsStrings: false,
  enumsAsConst: true,
  react: false,
  scalarTypes: {
    URL: 'string',
    DateTime: 'string',
    EmailAddress: 'string',
  },
  preImport: '',
  introspection: {
    endpoint: '../payloadcms/src/generated-schema.graphql',
  },
  destination: './src/graphql/payloadcms/generated-gqty/index.ts',
  subscriptions: false,
  javascriptOutput: false,
}

module.exports = config
