from enum import Enum

class StatusEnum(Enum):
    OPEN = (0, "Open")
    CLOSE = (1, "Close")

    @property
    def description(self):
        return self.value[1]

class TypeEnum(Enum):
    MEETING = (0, "Meeting")
    VIDEO_CALL = (1, "Video Call")
    CALL = (2, "Call")

    @property
    def description(self):
        return self.value[1]