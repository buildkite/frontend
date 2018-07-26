// Pretty formatter for recovery codes, pretty generic in case we change length!
export default (recoveryCode, separator = '-') => {
  // Find a best-fit length for segments
  const segmentLength = [8, 7, 6, 5].find((length) => (recoveryCode.length % length) === 0);

  // If we don't find one, just return the whole thing
  if (!segmentLength) {
    return recoveryCode;
  }

  // Otherwise, grab slices of the original string and join them with a separator
  return Array(recoveryCode.length / segmentLength).fill(null).map((_segment, index) => (
    recoveryCode.slice(index * segmentLength, (index + 1) * segmentLength)
  )).join(separator);
};
