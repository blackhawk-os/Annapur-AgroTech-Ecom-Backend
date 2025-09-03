
const { body, param, validationResult } = require("express-validator");

const PAYMENT_METHODS = ["cod", "card", "upi", "esewa"];
// when creating order, we validate customer, address, and payment (items come from cart)
const validateCreateOrder = [
  param("userId").isMongoId().withMessage("Invalid user ID"),
  body("customer.fullName").isString().trim().notEmpty().withMessage("Customer full name is required"),
  body("customer.email").isEmail().withMessage("Valid customer email is required"),
  body("customer.phone").isString().trim().notEmpty().withMessage("Customer phone is required"),
  body("shippingAddress.address").isString().trim().notEmpty().withMessage("Address is required"),
  body("shippingAddress.city").isString().trim().notEmpty().withMessage("City is required"),
  body("shippingAddress.state").isString().trim().notEmpty().withMessage("State is required"),
  body("paymentMethod").isIn(PAYMENT_METHODS).withMessage("Invalid payment method"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

const validateRegister = [
  body("fullName").isString().trim().notEmpty().withMessage("Full name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("phone").optional().isString(),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  body("confirmPassword").custom((val, { req }) => {
    if (val !== req.body.password) throw new Error("Passwords do not match");
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

const validateLogin = [
  body("email").isEmail(),
  body("password").isString().notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

const validateCartAdd = [
  param("userId").isMongoId(),
  body("productId").isMongoId().withMessage("Valid productId is required"),
  body("quantity").isInt({ min: 1, max: 50 }).withMessage("Quantity 1-50"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

const validateCartUpdate = [
  param("userId").isMongoId(),
  param("productId").isMongoId(),
  body("quantity").isInt({ min: 1, max: 50 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });
    next();
  },
];

module.exports = {
  validateCreateOrder,
  validateRegister,
  validateLogin,
  validateCartAdd,
  validateCartUpdate,
};
