export type AudioExtractionErrorCode =
  | "unsupported_url"
  | "yt_dlp_unavailable"
  | "media_provider_unavailable"
  | "media_unavailable"
  | "image_post_unsupported"
  | "media_too_long"
  | "media_too_large"
  | "ffmpeg_failed"
  | "process_timeout"
  | "audio_empty";

export class AudioExtractionError extends Error {
  constructor(
    public readonly code: AudioExtractionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AudioExtractionError";
  }
}
