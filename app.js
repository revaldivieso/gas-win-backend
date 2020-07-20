import { savePerson, listPerson, findPersonByRut } from './mongo.mjs';

import Hapi from '@hapi/hapi';
import Joi from '@hapi/joi';
import Qs from 'qs';
import { updateStatusPerson } from './mongo.mjs';

const server = Hapi.server({
    port: 3002,
    host: 'localhost',
    query: {
        parser: (query) => Qs.parse(query)
    }
});

const init = async () => {

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});


server.route({
    method: 'POST',
    path: '/person',
    handler: async function (request, h) {
        const payload = request.payload;
        const prev = await findPersonByRut(payload.rut)
        if (prev) {
            return h.response({ message: "Rut Registrado"}).code(400);
        }
        return savePerson(payload);
    },
    options: {
        cors: true,
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                address: Joi.string().required(),
                position: Joi.string().required(),
                rut: Joi.string().pattern(/^\d{0,10}-[\dkK]$/).required()
            })
        }
    }
});

server.route({
    method: 'GET',
    path: '/person',
    options: {
        cors: true
    },
    handler: async function (request, h) {
        return await listPerson();
    }
});

server.route({
    method: 'GET',
    path: '/person/rut',
    options: {
        cors: true,
        validate: {
            query: Joi.object({
                rut: Joi.string().pattern(/^\d{0,10}-[\dkK]$/).required()
            }).options({ stripUnknown: true })
        }
    },
    handler: async function (request, h) {
        return await findPersonByRut(request.query.rut);
    }
});

server.route({
    method: 'PUT',
    path: '/person/{id}/status',
    options: {
        cors: true,
    },
    handler: function (request, h) {
        return updateStatusPerson(request.params.id, request.payload.status);
    }
});

init();