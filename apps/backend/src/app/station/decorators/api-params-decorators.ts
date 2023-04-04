import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

export const searchQuery = ApiImplicitQuery({
  name: 'search',
  description: 'Search in the database',
  required: false,
  type: String,
});

export const page = ApiImplicitQuery({
  name: 'page',
  description: 'page number',
  required: false,
  type: Number,
});

export const limit = ApiImplicitQuery({
  name: 'limit',
  description: 'number of rows per page',
  required: false,
  type: Number,
});
export const filterByMonth = ApiImplicitQuery({
  name: "month",
  description: "The maximum number of transactions to return",
  required: false,
  type: String
})
