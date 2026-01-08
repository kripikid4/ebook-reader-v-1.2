export const isPdf = (file: File | string): boolean => {
  if (file instanceof File) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }
  return file.toLowerCase().endsWith('.pdf');
};

export const isEpub = (file: File | string): boolean => {
  if (file instanceof File) {
    return file.type === 'application/epub+zip' || file.name.toLowerCase().endsWith('.epub');
  }
  return file.toLowerCase().endsWith('.epub');
};
