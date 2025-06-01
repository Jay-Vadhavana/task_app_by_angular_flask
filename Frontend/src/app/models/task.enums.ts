export enum TaskType {
  MEETING = 0,
  VIDEO_CALL = 1,
  CALL = 2
}

export const TaskTypeDescriptions: { [key in TaskType]: string } = {
  [TaskType.MEETING]: 'Meeting',
  [TaskType.VIDEO_CALL]: 'Video Call',
  [TaskType.CALL]: 'Call'
};

export enum TaskStatus {
  OPEN = 0,
  CLOSE = 1
}

export const TaskStatusDescriptions: { [key in TaskStatus]: string } = {
  [TaskStatus.OPEN]: 'Open',
  [TaskStatus.CLOSE]: 'Close'
};