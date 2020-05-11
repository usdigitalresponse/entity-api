require("dotenv").config();
const SAM_API_KEY = process.env.SAM_API_KEY;

const { ApolloServer, gql } = require("apollo-server");
const { RESTDataSource } = require("apollo-datasource-rest");

const typeDefs = gql`
  type Entity {
    duns: String
    name: String
    amount: Float
    certifications: String
  }

  type Query {
    entity(duns: String!): Entity
  }
`;

const entityReducer = (entity) => {
  return {
    duns: entity.sam_data.registration.duns || 0,
    name: entity.sam_data.registration.legalBusinessName || "N/A",
    certifications: entity.sam_data.registration.certificationsURL.pdfUrl || "",
  };
};

const recipientReducer = (recipient) => {
  return {
    amount: parseFloat(recipient[0].amount) || 0,
  };
};

class USASpendingAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.usaspending.gov/api/v2/recipient/children/";
  }

  async getRecipientAmount(duns) {
    const data = await this.get(`${duns}`);
    return recipientReducer(data);
  }
}

class EntityAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://api.data.gov/sam/v8/registrations";
  }

  async getEntity(duns) {
    if (duns.length < 9) {
      duns = duns.toString().padStart(9, "0");
    }
    const data = await this.get(`/${duns}0000?api_key=${SAM_API_KEY}`);
    return entityReducer(data);
  }
}

const resolvers = {
  Query: {
    entity: async (_, { duns }, { dataSources }) => {
      const entity = await dataSources.entityAPI.getEntity(duns);
      const amount = await dataSources.usaSpendingAPI.getRecipientAmount(duns);
      return { ...entity, ...amount };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    entityAPI: new EntityAPI(),
    usaSpendingAPI: new USASpendingAPI(),
  }),
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
