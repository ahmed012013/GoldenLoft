import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpStatus,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { BirdsService } from './birds.service';
import { CreateBirdDto } from '@shared/dtos/create-bird.dto';
import { GetBirdsDto } from '@shared/dtos/get-birds.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('birds')
export class BirdsController {
  constructor(private readonly birdsService: BirdsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
          return cb(
            new BadRequestException(
              'Validation failed (expected type is /^image\\/(jpg|jpeg|png|webp)$/)'
            ),
            false
          );
        }
        cb(null, true);
      },
      storage: diskStorage({
        destination: './uploads/birds',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, uniqueSuffix);
        },
      }),
    })
  )
  create(
    @Request() req: RequestWithUser,
    @Body() createBirdDto: CreateBirdDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      })
    )
    file?: Express.Multer.File
  ) {
    if (file) {
      return this.birdsService.create(req.user.userId, {
        ...createBirdDto,
        image: `/uploads/birds/${file.filename}`,
      });
    }
    return this.birdsService.create(req.user.userId, createBirdDto);
  }

  @Get()
  findAll(@Request() req: RequestWithUser, @Query() query: GetBirdsDto) {
    return this.birdsService.findAll(req.user.userId, query);
  }

  @Get('stats')
  getStats(@Request() req: RequestWithUser) {
    return this.birdsService.getStats(req.user.userId);
  }

  @Get(':id/pedigree')
  getPedigree(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.birdsService.getPedigree(req.user.userId, id);
  }

  @Get('by-ring/:ringNumber')
  findByRingNumber(
    @Request() req: RequestWithUser,
    @Param('ringNumber') ringNumber: string
  ) {
    return this.birdsService.findByRingNumber(req.user.userId, ringNumber);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.birdsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateBirdDto: Partial<CreateBirdDto>
  ) {
    return this.birdsService.update(req.user.userId, id, updateBirdDto);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.birdsService.remove(req.user.userId, id);
  }
}
