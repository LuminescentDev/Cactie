export type LeaveJoinMessage = {
  channelId?: string;
  message: string | false;
};
export type LeaveJoinMessageSetting = {
  leave: LeaveJoinMessage;
  join: LeaveJoinMessage;
}