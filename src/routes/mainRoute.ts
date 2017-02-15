/**
 * routes/mainRoute.ts
 */
import { Router } from 'express';
import { mainCtrl } from '../controllers';

const mainRoute: Router = Router();

mainRoute.get('/', mainCtrl.render);

export { mainRoute };
