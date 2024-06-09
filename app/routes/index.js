const category = require('./Category');
const user = require('./User');
const product = require('./Product');
const cart = require('./Cart');
const order = require('./Order');

const routes = (app) => {
    app.use('/categories', category)
    app.use('/users', user)
    app.use('/products', product)
    app.use('/carts', cart)
    app.use('/orders', order)
}

module.exports = routes;
