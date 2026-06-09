import { APIMessageTopLevelComponent } from 'discord-api-types/v10';

export type LeaveJoinMessage = {
  channelId?: string;
  message?: {
    components: APIMessageTopLevelComponent[];
  };
};
export type LeaveJoinMessageSetting = {
  leave: LeaveJoinMessage;
  join: LeaveJoinMessage;
}