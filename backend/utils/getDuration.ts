import ffmpeg from 'fluent-ffmpeg';

export const getAudioDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        return reject(err);
      }

      const duration = metadata.format.duration;
      resolve(duration ? Math.round(duration) : 0);
    });
  });
};
