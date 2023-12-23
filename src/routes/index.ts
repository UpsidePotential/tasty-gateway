import express from 'express';
import { accountsRoute } from './accounts';
import { borrowRoute } from './borrow';
import { defaultRoute } from './defaultRoute';

export const routes = express.Router();

routes.use(defaultRoute);
routes.use(accountsRoute)
routes.use(borrowRoute);