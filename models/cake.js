const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const toppingSchema= new Schema({
    type:{
        type: String,
        required: true,
        unique : true,
    },
    price_extra:{
        type: Number,
        required: true,
        unique : true,
    }
})

const cakeSchema = new Schema({
    type : {
        type: String,
        required: true,
        unique : true,
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
   topping:[toppingSchema]
});
const Cake = mongoose.model('Cake', cakeSchema);
module.exports = Cake;