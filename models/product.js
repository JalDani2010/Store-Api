const mongoose = require('mongoose');  


const ProductSchema  = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please provide name'],
        maxlength: [20, 'Name cannot be more than 20 characters']
    },
    featured:{
        type: Boolean,
        default: false
    },
    rating:{
        type: Number,
        default: 4.5
    },
    price:{
        type: Number,
        required: [true, 'Please provide price']
    },
    company:{
        type: String,
        enum: {
            values: ['ikea', 'liddy', 'caressa', 'marcos'],
            message: '{VALUE} is not supported'
        }
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Product', ProductSchema);