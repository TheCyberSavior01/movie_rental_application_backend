const express = require("express");
const router = express.Router();
const { Customer, validateCustomer } = require("../models/customerModel");

// Get all the customers
router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

// Create a new customer
router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(error.details[0].message);
  let customer = new Customer(req.body);
  customer = await customer.save();
  res.send(customer);
});

// Update a new customer
router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  res.send(customer);
});

// Delete an existing customer
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  res.send(customer);
});

module.exports = router;
