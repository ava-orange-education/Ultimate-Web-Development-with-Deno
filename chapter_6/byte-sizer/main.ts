
export function getFileSize(path: string): number {
  const fileInfo = Deno.statSync(path);
  const fileSizeInBytes = fileInfo.size;
  const fileSizeInKilobytes = Math.ceil(fileSizeInBytes / 1024);
  return fileSizeInKilobytes;
}
