def parse_datetime(value):
    if isinstance(value, datetime):
        return value
    elif isinstance(value, str):
        return parser.parse(value)
    else:
        raise ValueError("Invalid datetime format")