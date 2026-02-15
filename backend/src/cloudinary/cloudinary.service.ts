import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'goldenloft/birds' },
        (error, result) => {
          if (error) return reject(error);
          // سطر التأمين: لو مفيش نتيجة، ارمي غلط بدل ما تبعت undefined
          if (!result)
            return reject(
              new Error('Cloudinary upload failed: No result returned')
            );
          resolve(result);
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
