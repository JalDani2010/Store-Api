const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
};

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, select, numericFilter } = req.query;
  const queryObject = {};
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  let result = Product.find(queryObject);
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }
  if (select) {
    const selectList = select.split(",").join(" ");
    result = result.select(selectList);
  }
  if (numericFilter) {
    const operatorMap = { 
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilter.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ['price', 'rating'];
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        result = result.find({ [field]: { [operator]: Number(value) } });
      }
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = { getAllProducts, getAllProductsStatic };
