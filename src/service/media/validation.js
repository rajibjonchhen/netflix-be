import { checkSchema, validationResult } from "express-validator";

const schema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "title validation failed , type must be string  ",
    },
  },
  type: {
    in: ["body"],
    isString: {
      errorMessage: "type validation failed , type must be  string ",
    },
  },
  year: {
    in: ["body"],
    isString: {
      errorMessage: "year validation failed , type must be string ",
    },
  },
  poster: {
    in: ["body"],
    isString: {
      errorMessage: "cover validation failed , type must be string",
    },
  },
};



const reviewSchema = {
  review: {
    isString: {
      errorMessage: "Text field is required for comment",
    },
  },
  rate: {
    isString: {
      errorMessage: "User name is required for comment",
    },
  },
};

export const checkReviewSchema = checkSchema(reviewSchema);

export const inputValidation = checkSchema(schema);

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Blog post validation is failed");
    error.status = 400;
    error.errors = errors.array();
    next(error);
  }
  next();
};