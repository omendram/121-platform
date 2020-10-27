/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageCodeEntity } from './image-code.entity';
import { Repository } from 'typeorm';
import { EXTERNAL_API } from '../../config';
import crypto from 'crypto';
import { ImageCodeNoWhatsappEntity } from './image-code-no-whatsapp.entity';

@Injectable()
export class ImageCodeService {
  @InjectRepository(ImageCodeEntity)
  private readonly imageRepository: Repository<ImageCodeEntity>;
  @InjectRepository(ImageCodeNoWhatsappEntity)
  private readonly imageNoWhatsappRepository: Repository<
    ImageCodeNoWhatsappEntity
  >;

  public constructor() {}

  public async createBarcode(code: string): Promise<string> {
    const image = await this.generateBarCode(code);

    let barcode = new ImageCodeEntity();
    barcode.secret = crypto.randomBytes(100).toString('hex') + '.png';
    barcode.image = image;
    this.imageRepository.save(barcode);

    // Also send a timestamp to see if the secret is older

    return EXTERNAL_API.imageCodeUrl + barcode.secret;
  }

  public async createBarcodeNoWhatsapp(
    code: string,
  ): Promise<ImageCodeNoWhatsappEntity> {
    const image = await this.generateBarCode(code);

    let barcode = new ImageCodeNoWhatsappEntity();
    barcode.image = image;
    return this.imageNoWhatsappRepository.save(barcode);
  }

  public async generateBarCode(code: string): Promise<string> {
    console.log('code: ', code);
    const bwipjs = require('bwip-js');
    const image = await bwipjs.toBuffer({
      bcid: 'code128', // Barcode type
      text: code, // Text to encode
      scale: 3, // 3x scaling factor
      height: 10, // Bar height, in millimeters
      includetext: true, // Show human-readable text
      textxalign: 'center', // Always good to set this,
      backgroundcolor: 'FFFFFF',
      padding: 10,
    });
    return image;
  }

  public async get(secret: string): Promise<any> {
    const imageCode = await this.imageRepository.findOne({ secret: secret });
    // Removes the image from the database after getting it
    // await this.imageRepository.remove(imageCode);
    return imageCode.image;
  }
}
