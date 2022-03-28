import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { NoteService } from './note.service';
import { CreateNoteDto, EditNoteDto } from './dto';

@UseGuards(JwtGuard)
@Controller('note')
export class NoteController {
  constructor(private noteService: NoteService) {}

  @Get()
  getNotesByUser(@GetUser('id') userId: number) {
    return this.noteService.getNotesOfUser(userId)
  }

  @Post()
  createNote(@GetUser('id') userId: number, @Body() dto: CreateNoteDto) {
    return this.noteService.createNote(userId, dto)
  }
}
