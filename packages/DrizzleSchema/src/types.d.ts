import { APIMessageTopLevelComponent } from 'discord-api-types/v10';

export type LeaveJoinMessage = {
  channelId?: string;
  message: {
    components: APIMessageTopLevelComponent[];
  } | false;
};
export type LeaveJoinMessageSetting = {
  leave: LeaveJoinMessage;
  join: LeaveJoinMessage;
}