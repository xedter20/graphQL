//Mongoose models
const Project = require('../models/Project.js');
const Client = require('../models/Client.js');

const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

// Client Type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => {
    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      phone: { type: GraphQLString }
    };
  }
});

// Project Type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => {
    return {
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      description: { type: GraphQLString },
      status: { type: GraphQLString },
      // add relationship
      client: {
        type: ClientType,
        resolve(parent, args) {
          // client is a child of project
          // (project)->(client)
          return clients.find(client => {
            return client.id === parent.clientId;
          });
        }
      }
    };
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    clients: {
      type: new GraphQLList(ClientType),
      resolve(parent, args) {
        return Client.find();
      }
    },
    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      }
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve(parent, args) {
        return Project.find();
      }
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      }
    }
  }
});

// Mutations
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addClient: {
      type: ClientType,
      args: {
        name: {
          type: GraphQLString
        },
        email: {
          type: GraphQLString
        },
        phone: {
          type: GraphQLString
        }
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone
        });

        return client.save(); // save to db
      }
    },
    deleteClient: {
      type: ClientType,
      args: {
        id: {
          type: GraphQLID
        }
      },
      resolve(parent, args) {
        return Client.findByIdAndDelete(args.id);
      }
    }
  }
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
