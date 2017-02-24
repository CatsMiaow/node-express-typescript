/**
 * controllers/MainCtrl.ts
 */
import { RequestHandler } from 'express';

export class MainCtrl {
  public render: RequestHandler = (req, res) => {
    res.render('index', { content: 'Hello, world!' });
  }
}

export const mainCtrl = new MainCtrl();
