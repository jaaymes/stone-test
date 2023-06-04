"use strict";
/**
 * Este Script tem como objetivo gerar dados para atender o desafio Front-end Admin. As informações
 * são processadas de forma randômica, ou seja, a cada nova geracão um novo valor é retornado.
 * A informação gerada pelo mesmo servirá somente para estudo e implementacão do desafio apresentado.
 * O mesmo apresenta dados fictícios que nao condizem com a realidade.
 *
 * Para rodar o mesmo será necessário
 * 1- npm install -g ts-node
 * 2- ts-node .\generator.ts
 * 3- console.log(getUsers());
 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var references = {
    users: [
        'Lucas da Silva',
        'Tiago Rodrigues',
        'Rafael Ribeiro',
        'Leonardo',
        'Rafaela Ferreira',
        'Pelican Pier',
        'Green Birds',
        '...',
        'Lumena Dias da Fonseca Martins Rodrigues Alves da Silva',
        'Sand Caravan',
        undefined,
        undefined,
        'Luiz Rogério',
        'Alice Franco',
        'Rafael Rodrigues da Silva',
        'Amanda Almeida Imperador da Silva Pinto Rodrigues',
        'Tiago',
    ],
    features: ['card', 'reset-password', 'debit', 'credit'],
    neighborhood: [
        'Benedito Bentes',
        'Centro',
        'Região 16',
        'Saramandaia',
        'Vila Montes Claros',
        'Cidade Nova',
    ],
    cities: [
        'Palhoça',
        'Uberaba',
        'Boa Vista',
        'Rio Branco',
        'Novo Hamburgo',
        'Santana',
    ],
    state: ['SP', 'MG', 'RJ', 'AP', 'AL'],
};
var randomDate = function (start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
var getAnalysts = function () {
    var analysts = references.users
        .map(function (_, index) { return ({
        id: generateRandomNumber(1, 10000),
        user_id: index,
    }); })
        .slice(-3)
        .map(function (value, index) { return (__assign(__assign({}, value), { email: "admin".concat(index, "@gmail.com"), password: "admin".concat(index) })); });
    analysts[0] = __assign(__assign({}, analysts[0]), { roles: ['n1', 'n2'] });
    analysts[1] = __assign(__assign({}, analysts[1]), { roles: ['n1'] });
    analysts[2] = __assign(__assign({}, analysts[2]), { roles: ['n2'] });
    return analysts;
};
var generateRandomNumber = function (min, max) {
    var value = Math.round(Math.random() * (max - min) + min);
    return value;
};
var onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
};
var randomStatusCard = function () {
    var status = ['requested', 'approved', 'processed', 'canceled', 'rejected'];
    var randomIndex = generateRandomNumber(0, status.length - 1);
    return status[randomIndex];
};
var getUsers = function () {
    return references.users.map(function (value, index) { return ({
        name: value,
        email: value !== undefined
            ? value.split(' ').join('_').toLocaleLowerCase().concat('@gmail.com')
            : '',
        BirthDate: randomDate(new Date(2012, 0, 1), new Date()),
        createdAt: randomDate(new Date(2012, 0, 1), new Date()),
        updatedAt: generateRandomNumber(0, 1)
            ? randomDate(new Date(2012, 0, 1), new Date())
            : null,
        enabledFeatures: [
            generateRandomNumber(0, 3),
            2,
            generateRandomNumber(0, 3),
        ].filter(onlyUnique),
        document: generateRandomNumber(10000000000, 99999999999),
        metadatas: {
            validDocument: true,
            verified: Boolean(generateRandomNumber(0, 1)),
        },
        address: {
            streetNumber: generateRandomNumber(0, 1000),
            city: references.cities[generateRandomNumber(0, references.cities.length - 1)],
            state: references.state[generateRandomNumber(0, references.state.length - 1)],
            neighborhood: references.neighborhood[generateRandomNumber(0, references.neighborhood.length - 1)],
            postalCode: "".concat(generateRandomNumber(10000, 99999), "-").concat(generateRandomNumber(100, 999)),
        },
        salaryBase: generateRandomNumber(100000, 1000000),
        id: index,
    }); });
};
var getCards = function () {
    return references.users
        .map(function (value, index) { return ({
        createdAt: randomDate(new Date(2012, 0, 1), new Date()),
        updatedAt: null,
        status: randomStatusCard(),
        id: index + 1000,
        user_id: index,
        metadatas: {
            name: value,
            digits: generateRandomNumber(1000, 9999),
            limit: generateRandomNumber(1000, 9999),
        },
    }); })
        .slice(1, references.users.length - 5);
};
var getFeatures = function () {
    var result = references.features.map(function (value, index) { return ({
        id: index,
        name: value,
    }); });
    return { result: result, status: 200 };
};
var getAudits = function () {
    var result = [
        {
            id: 0,
            createdAt: '2021-02-28T23:00:02.790Z',
            type: 'card-status-change',
            before: {
                createdAt: '2012-12-14T11:23:05.635Z',
                id: 1001,
                metadatas: { name: 'Tiago Rodrigues', digits: 4405 },
                digits: 4405,
                name: 'Tiago Rodrigues',
                status: 'requested',
                updatedAt: null,
                user_id: 1,
            },
            after: {
                createdAt: '2012-12-14T11:23:05.635Z',
                id: 1001,
                metadatas: { name: 'Tiago Rodrigues', digits: 4405 },
                digits: 4405,
                name: 'Tiago Rodrigues',
                status: 'rejected',
                updatedAt: null,
                user_id: 1,
            },
            requestedBy: 11112,
        },
    ];
    return result;
};
exports.db = {
    users: getUsers(),
    analysts: getAnalysts(),
    cards: getCards(),
    features: getFeatures(),
    audits: getAudits(),
};
