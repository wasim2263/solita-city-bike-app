import {ApiImplicitQuery} from "@nestjs/swagger/dist/decorators/api-implicit-query.decorator";

export const searchQuery = ApiImplicitQuery({
  name: 'search',
  description: 'Search in the database',
  required: false,
  type: String,
});

export const orderByQuery = ApiImplicitQuery({
  name: 'orderBy',
  description: 'Order by field',
  required: false,
  type: String,
});

export const orderQuery = ApiImplicitQuery({
  name: 'order',
  description: 'Order: asc|desc',
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
