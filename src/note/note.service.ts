import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto, EditNoteDto } from './dto';

@Injectable()
export class NoteService {
  constructor(private prisma: PrismaService) {}

  getNotesOfUser(userId: number){
    return this.prisma.note.findMany({
      where: {
        userId
      }
    })
  }

  async createNote(userId: number, dto: CreateNoteDto) {
    const note = await this.prisma.note.create({
      data: {
        userId,
        ...dto
      }
    })
    return note
  }
  
}
