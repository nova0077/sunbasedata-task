const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.url, req.method);
  next();
});

let customer_list = [
  {
    uuid: "123",
    first_name: "cs_mshr",
    last_name: "mishra",
    street: "221B",
    address: "koregaon park",
    city: "Pune",
    state: "India",
    email: "cs_mshr@gmail.com",
    phone: "8673847682",
  },
  {
    uuid: "456",
    first_name: "Praveen",
    last_name: "Nooka",
    street: "Pune",
    address: "H no 2 ",
    city: "Delhi",
    state: "Delhi",
    email: "sam@gmail.com",
    phone: "12345678",
  },
];

app.post("/login", async (req, res) => {
  const { login_id, password } = req.body;

  const access_token = {
    access_token: "dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=",
  };
  res.header("Content-Type", "application/json").json(access_token);
});

app.get("/getlist", async (req, res) => {
  res.json(customer_list);
});

app.post("/addcustomer", (req, res) => {
  const newCustomer = req.body;
  const orderedCustomer = {
    uuid: newCustomer.uuid,
    first_name: newCustomer.first_name,
    last_name: newCustomer.last_name,
    street: newCustomer.street,
    address: newCustomer.address,
    city: newCustomer.city,
    state: newCustomer.state,
    email: newCustomer.email,
    phone: newCustomer.phone,
  };

  customer_list.push(orderedCustomer);
  res.json({
    message: "Customer added successfully",
    customer: orderedCustomer,
  });
});

function deleteCustomer(uuid) {
  let uuidExists = false;
  customer_list = customer_list.filter((customer) => {
    if (customer.uuid == uuid) {
      uuidExists = true;
    }
    return customer.uuid !== uuid;
  });
  return uuidExists;
}

app.delete("/deletecustomer/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  const uuidExists = deleteCustomer(uuid);

  if (uuidExists)
    return res.status(200).json({ message: "Customer deleted successfully" });
  return res.status(404).json({ message: "Customer not found" });
});

app.patch("/updatecustomer/:uuid", (req, res) => {
  const uuid = req.params.uuid;
  const updatedCustomer = req.body;

  // Find the index of the customer with the specified UUID
  const customerIndex = customer_list.findIndex(
    (customer) => customer.uuid === uuid
  );

  if (customerIndex !== -1) {
    // Update the customer details
    customer_list[customerIndex] = {
      ...customer_list[customerIndex],
      ...updatedCustomer,
      uuid: uuid, // Ensure UUID is not changed during the update
    };

    // Send success response
    res.status(200).json({
      message: "Customer updated successfully",
      customer: customer_list[customerIndex],
    });
  } else {
    // Send error response if UUID is not found
    res.status(500).json({ message: "UUID not found" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
