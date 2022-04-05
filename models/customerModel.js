const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  isGold: { type: Boolean },
});

const Customer = mongoose.model("Customer", customerSchema);

// function for validating user input
const validateCustomer = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    isGold: Joi.boolean(),
  });

  return schema.validate(data);
};

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
