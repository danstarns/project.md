const { SchemaDirectiveVisitor } = require("graphql-tools");
const { defaultFieldResolver } = require("graphql");
const { IdioDirective } = require("idio-graphql");
const { gql, AuthenticationError } = require("apollo-server-express");
const { User } = require("../../../models/index.js");

class AuthDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;

        const {
            input: { required, populate }
        } = this.args;

        field.resolve = async function wrappedResolver(...resolverArguments) {
            const [, , context = {}] = resolverArguments;

            const { user } = context;

            if (!user && required) {
                throw new AuthenticationError("Unauthorized");
            }

            const foundUser = await User.findById(user);

            if (!foundUser) {
                throw new AuthenticationError("Unauthorized");
            }

            if (populate) {
                resolverArguments[2].user = foundUser;
            }

            const result = await resolve.apply(this, resolverArguments);

            return result;
        };
    }
}

const Auth = new IdioDirective({
    name: "Auth",
    typeDefs: gql`
        input AuthInput {
            required: Boolean!
            populate: Boolean = false
        }

        directive @Auth(input: AuthInput) on FIELD_DEFINITION
    `,
    resolver: AuthDirective
});

module.exports = Auth;
