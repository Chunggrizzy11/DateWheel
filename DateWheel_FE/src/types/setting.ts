export interface Settings {
  _id: string;
  owner: string;
  darkMode: boolean;
  sound: boolean;
  animation: boolean;
  language: 'vi' | 'en';
}

export interface UpdateSettingsDto {
  owner: string;
  darkMode?: boolean;
  sound?: boolean;
  animation?: boolean;
  language?: 'vi' | 'en';
}
