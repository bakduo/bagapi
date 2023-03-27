import {
  Controller,
  Get,
  Put,
  Post,
  Res,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { CustomRequestPayload } from '../middleware/upload-stream.middleware';
import { Response } from 'express';

@Controller('itemfiles')
export class ItemFilesController {
  @Post()
  create(@Res() res: Response, req: CustomRequestPayload) {
    return res
      .status(HttpStatus.CREATED)
      .json({ message: 'Save data OK', status: true, file: req.payload });
  }

  @Get()
  findAll(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Content Find it', status: true });
  }

  @Put()
  update(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Upadate content OK', status: true });
  }

  @Delete(':id')
  remove(@Res() res: Response) {
    return res.status(200).json({ message: 'Content deleted', status: true });
  }
}
