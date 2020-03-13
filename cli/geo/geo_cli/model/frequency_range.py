class FrequencyRange:
    def __init__(self, *, maxInclusive: float, minInclusive: float):
        self.__maxInclusive = maxInclusive
        self.__minInclusive = minInclusive

    @property
    def maxInclusive(self):
        return self.__maxInclusive

    @property
    def minInclusive(self):
        return self.__minInclusive
