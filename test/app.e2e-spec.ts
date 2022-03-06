import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test} from '@nestjs/testing'
import * as pactum from 'pactum'
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module'
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService)
    await prisma.cleanDB()

    pactum.request.setBaseUrl('http://localhost:3333')
  })
  afterAll(() => {
    app.close();
  });
  describe("Auth",() => {
    const dto:AuthDto = {
      email: 'kenshin@gmail.com',
      password: '123'
    }
    describe("Signup", ()=> {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          )
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          )
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      })
      it('should throw if body empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          )
          .expectStatus(400)
      })
      it('should signup', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          )
          .withBody(dto)
          .expectStatus(201)
      })
    })
    describe("Signin", () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          )
          .withBody({
            password: dto.password
          })
          .expectStatus(400)
      })
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          )
          .withBody({
            email: dto.email
          })
          .expectStatus(400)
      })
      it('should throw if body empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          )
          .expectStatus(400)
      })
      it('should signin', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          )
          .withBody(dto)
          .expectStatus(201)
          .stores('userAt', 'access_token')
      })
    })
  })
  describe("User", () => {
    describe("Get me", ()=>{
      it('should get user info', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    })
    describe("Edit user", ()=>{
      it('edit user info', () => {
        const dto: EditUserDto = {
          firstName: "Kenishin",
          email: "batousai@gmail.com"
        }
        return pactum
          .spec()
          .patch('/users/edit')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email)
      })
    })
  })
  describe("Bookmarks", () => {
    describe("Get empty bookmark", ()=>{
      it('should get empty bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    })
    describe("Create bookmark", ()=>{
      const dto: CreateBookmarkDto = {
        title: 'First Bookmark',
        link: 'https://mern-todo-task.web.app/todo'
      }
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link)
          .stores('bookmarkId', 'id')
      })
    })
    describe("Get bookmarks", ()=>{
      it('should get all bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectJsonLength(1)
      })
    })
    describe("Get bookmark by id", ()=>{
      it('should get bookmark', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
    })
    describe("Edit bookmark", ()=>{
      const dto: EditBookmarkDto = {
        title: "todo task website",
        description: "make a reminder of your todos"
      }
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
      })
    })
    describe("Delete bookmark", ()=>{
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(204)
      })
    })
    describe("Get empty bookmark again", ()=>{
      it('should get empty bookmark again', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    })
  })

})