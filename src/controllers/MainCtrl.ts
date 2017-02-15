/**
 * controllers/MainCtrl.ts
 */
import { Request, Response } from 'express';

export class MainCtrl {
  public render(req: Request, res: Response) {
    res.render('index', { content: 'Hello, world!' });
  }
}

export const mainCtrl: MainCtrl = new MainCtrl();
