function useTextTruncation() {
  const truncateText = (text:string, maxLength:number) => {
    if (text.length <= maxLength) {
      return text;
    }

    const indexOfDot = text.lastIndexOf('.');
    const maxTextLength = maxLength - Math.min(maxLength, text.length - indexOfDot);

    if (indexOfDot >= 0 && maxTextLength > 0) {
      const truncatedText = text.slice(0, maxTextLength);
      const fileFormat = text.slice(indexOfDot);
      return `${truncatedText}...${fileFormat}`;
    }

    return text.slice(0, maxLength) + '...';
  };

  return truncateText;
}

export default useTextTruncation;
