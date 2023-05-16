export interface AttachedFile {
  storage: string,
  url: string,
  size: number,
  data: FileData,
  originalName: string
}

interface FileData {
  id: string
}
