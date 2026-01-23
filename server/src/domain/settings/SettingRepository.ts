import { Setting } from './Setting';

export interface ISettingRepository {
  save(setting: Setting): Promise<Setting>;
  findByKey(key: string): Promise<Setting | null>;
  findAll(): Promise<Setting[]>;
  delete(key: string): Promise<void>;
}
