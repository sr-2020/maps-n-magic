export class Migrator {
  static versionMigrators = {
    '0.1.0': Migrator._010_to_020,
  }

  static migrate(database) {
    while (this.versionMigrators[database.version]) {
      const prevVersion = database.version;
      database = Migrator.versionMigrators[database.version](database);
      if (database.version === prevVersion) {
        throw new Error(`Migrating on ${prevVersion} doesn't change version`);
      }
    }
    return database;
  }

  // eslint-disable-next-line class-methods-use-this, camelcase
  static _010_to_020(database) {
    database.soundMapping = {
      manaLevels: database.soundMapping || {},
      spiritFractions: {},
    };
    database.version = '0.2.0';
    return database;
  }
}
