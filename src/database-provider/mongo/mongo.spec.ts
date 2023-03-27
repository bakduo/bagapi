import { appconfig } from '../../config/configure-app';
import { Mongo } from './mongo';

describe('Mongo', () => {
  it('should be defined', () => {
    const mongo = Mongo.getInstance(
      appconfig.db.config.mongo.url,
      appconfig.db.config.mongo.user,
      appconfig.db.config.mongo.password,
      appconfig.db.config.mongo.dbname,
      appconfig.db.config.mongo.secure,
    ).getConnection();

    expect(mongo).toBeDefined();
  });
});
