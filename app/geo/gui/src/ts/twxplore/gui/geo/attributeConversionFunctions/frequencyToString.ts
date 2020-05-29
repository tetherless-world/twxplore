export const frequencyToString = (frequencyValue: number) => {
    return ( (
        Math.floor((frequencyValue / 1000000) * 100) / 100
      ).toString() +
      " " +
      "MHz")
}