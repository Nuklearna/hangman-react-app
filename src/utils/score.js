export const smarter = (L, U, E, T) => {
    const baseScore = L * U * 100;
    const errorPenalty = E * 50;
    const timePenalty = T / 1000;

    return baseScore - errorPenalty - timePenalty;
};
