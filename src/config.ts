/**
 * config.ts
 */
export interface IConfig {
  env: string;
  port: number;
  cwd: string;
  path?: string;
}
/*// other way 1
type IConfig = {
  env: string;
  port: number;
  cwd: string;
};
// other way 2
const config = {
  env: <string> process.env.NODE_ENV || 'localhost',
  port: <number> process.env.PORT || 8000,
  cwd: <string> cwd
};*/

// 공통설정
export const config: IConfig = {
  env: process.env.NODE_ENV || 'localhost',
  port: process.env.PORT || 8000,
  cwd: process.cwd()
};

switch (config.env) {
  case 'localhost':
    Object.assign(config, {
      path: '/local/'
    });
    break;
  case 'development':
    Object.assign(config, {});
    break;
  case 'production':
    Object.assign(config, {});
    break;
  default:
    process.exit(1);
    break;
}
