export const range = (start: number, end?: number): number[] => {
    const loopStart = end ? start : 1;
    const loopEnd = end ? end : start;
    const result: number[] = [];
    for (let i = loopStart; i <= loopEnd; i++) {
        result.push(i);
    }
    return result;
}