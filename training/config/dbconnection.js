module.exports.dbConnection={
    user: 'devbrugu',
    password: 'brugu',
    server: '45.79.140.99',
    database: 'rgca_dev',
    pool: {
        max: 100,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options:{
        trustServerCertificate: false,
        encrypt: false
    }
};
