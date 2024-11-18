import {
  object,
  string,
  instanceof as instanceof_,
  infer as infer_,
  number,
} from "zod";

export const JoinChatSchema = object({
  partnerId: string(),
});
export type JoinChatType = infer_<typeof JoinChatSchema>;

const ALLOWED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/tiff",
  "image/bmp",

  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
  "text/plain",
  "application/rtf",
  "application/vnd.oasis.opendocument.text", // .odt
  "application/vnd.oasis.opendocument.spreadsheet", // .ods
  "application/vnd.oasis.opendocument.presentation", // .odp

  // Audio
  "audio/mpeg", // .mp3
  "audio/wav",
  "audio/ogg",
  "audio/midi",
  "audio/x-m4a",
  "audio/webm",

  // Video
  "video/mp4",
  "video/mpeg",
  "video/quicktime", // .mov
  "video/x-msvideo", // .avi
  "video/x-ms-wmv", // .wmv
  "video/webm",
  "video/3gpp",
  "video/3gpp2",

  // Archives
  "application/zip",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",

  // Other
  "application/json",
  "application/xml",
  "application/x-shockwave-flash",
  "application/vnd.android.package-archive", // .apk
  "application/octet-stream",
];
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const SendMessageSchema = object({
  chatId: string(),
  content: string(),
  file: object({
    buffer: instanceof_(Buffer),
    originalname: string(),
    mimetype: string().refine((type) => ALLOWED_FILE_TYPES.includes(type), {
      message: `File type not allowed. Allowed type are: ${ALLOWED_FILE_TYPES.join(
        ","
      )}`,
    }),
    size: number().max(
      MAX_FILE_SIZE,
      `File size must not exceed ${MAX_FILE_SIZE / 1024 / 1024}MB`
    ),
  }).optional(),
});
export type SendMessageType = infer_<typeof SendMessageSchema>;

export const GetMessagesSchema = object({
  chatId: string(),
  page: number(),
  limit: number(),
});
export type GetMessagesType = infer_<typeof GetMessagesSchema>;

export const MarkAsReadSchema = object({ messageId: string() });
export type MarkAsReadType = infer_<typeof MarkAsReadSchema>;
