import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
  Delete,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { BirdsService } from './birds.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateBirdDto } from '@shared/dtos/create-bird.dto';
import { GetBirdsDto } from '@shared/dtos/get-birds.dto';
import { UpdateBirdDto } from '@shared/dtos/update-bird.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('birds')
export class BirdsController {
  constructor(
    private readonly birdsService: BirdsService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @Request() req: RequestWithUser,
    @Body() createBirdDto: CreateBirdDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    let imageUrl = createBirdDto['image'];
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file);
      imageUrl = upload.secure_url;
    }
    return this.birdsService.create(req.user.id, {
      ...createBirdDto,
      image: imageUrl,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateBirdDto: UpdateBirdDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    let imageUrl = updateBirdDto['image'];
    if (file) {
      const upload = await this.cloudinaryService.uploadFile(file);
      imageUrl = upload.secure_url;
    }
    return this.birdsService.update(req.user.id, id, {
      ...updateBirdDto,
      image: imageUrl,
    });
  }

  @Get()
  findAll(@Request() req: RequestWithUser, @Query() query: GetBirdsDto) {
    return this.birdsService.findAll(req.user.id, query);
  }

  @Get('stats')
  getStats(@Request() req: RequestWithUser) {
    return this.birdsService.getStats(req.user.id);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.birdsService.remove(req.user.id, id);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.birdsService.findOne(req.user.id, id);
  }
}
