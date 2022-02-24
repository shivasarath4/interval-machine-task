const Joi = require('joi');
const { LONG } = require('mysql/lib/protocol/constants/types');

const CatagorySchema = Joi.object({
    catagory: Joi.string()
        .pattern(/^[A-Za-z]+$/)
        .min(3)
        .max(30)
        .required(),
})



// async function ValidateCatagory({catagory}) {
//     try {
//         let value = await CatagorySchema.validateAsync({ catagory: catagory});
//     }
//     catch (err) {
//         return err;
//      }
// }



module.exports = {CatagorySchema}