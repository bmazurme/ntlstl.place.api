import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { LikesService } from '../likes/likes.service';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../common/guards/jwt.guard';
import { CustomJwtGuard } from '../common/guards/custom.jwt.guard';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

const mockCardsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  likeCard: jest.fn(),
  dislikeCard: jest.fn(),
  remove: jest.fn(),
  getCount: jest.fn(),
  getCardsByUser: jest.fn(),
  getCardsByTag: jest.fn(),
  getCardsByPage: jest.fn(),
  getCardById: jest.fn(),
};

const mockLikesService = {
  like: jest.fn(),
  dislike: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  password: 'password',
  role: 'user',
} as unknown as User;

describe('CardsController', () => {
  let controller: CardsController;
  let cardsService: CardsService;
  // let likesService: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
        {
          provide: LikesService,
          useValue: mockLikesService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: JwtGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
        {
          provide: CustomJwtGuard,
          useValue: {
            canActivate: jest.fn().mockReturnValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<CardsController>(CardsController);
    cardsService = module.get<CardsService>(CardsService);
    // likesService = module.get<LikesService>(LikesService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call cardsService.create with correct params', async () => {
      const createCardDto = {
        title: 'Test Card',
        content: 'Test Content',
      } as unknown as CreateCardDto;

      await controller.create(createCardDto, mockUser);

      expect(cardsService.create).toHaveBeenCalledWith(createCardDto, mockUser);
      expect(cardsService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call cardsService.findAll with current user id', async () => {
      const req = { userId: 1 };

      await controller.findAll(req);

      expect(cardsService.findAll).toHaveBeenCalledWith(1);
      expect(cardsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should call cardsService.update with correct params', async () => {
      const id = '1';
      const updateCardDto = { title: 'Updated Title' } as UpdateCardDto;

      await controller.update(id, updateCardDto);

      expect(cardsService.update).toHaveBeenCalledWith(1, updateCardDto);
      expect(cardsService.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('like', () => {
    it('should call cardsService.likeCard with correct params', async () => {
      const id = '1';

      await controller.like(id, mockUser);

      expect(cardsService.likeCard).toHaveBeenCalledWith({ id: 1 }, mockUser);
      expect(cardsService.likeCard).toHaveBeenCalledTimes(1);
    });
  });

  describe('dislike', () => {
    it('should call cardsService.dislikeCard with correct params', async () => {
      const id = '1';

      await controller.dislike(id, mockUser);

      expect(cardsService.dislikeCard).toHaveBeenCalledWith(
        { id: 1 },
        mockUser,
      );
      expect(cardsService.dislikeCard).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should call cardsService.remove with correct params', async () => {
      const id = '1';

      await controller.remove(id, mockUser);

      expect(cardsService.remove).toHaveBeenCalledWith(1, mockUser);
      expect(cardsService.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCount', () => {
    it('should call cardsService.getCount with correct param', async () => {
      const id = '1';

      await controller.getCount(id);

      expect(cardsService.getCount).toHaveBeenCalledWith(1);
      expect(cardsService.getCount).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCardsByUser', () => {
    it('should call cardsService.getCardsByUser with correct params', async () => {
      const userId = '1';
      const page = '2';
      const req = { user: mockUser };

      await controller.getCardsByUser(userId, page, req);

      expect(cardsService.getCardsByUser).toHaveBeenCalledWith(1, 2, mockUser);
      expect(cardsService.getCardsByUser).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCardsByTag', () => {
    it('should call cardsService.getCardsByTag with correct params', async () => {
      const tagName = 'test-tag';
      const page = '3';
      const req = { user: mockUser };

      await controller.getCardsByTag(tagName, page, req);

      expect(cardsService.getCardsByTag).toHaveBeenCalledWith(
        tagName,
        3,
        mockUser,
      );
      expect(cardsService.getCardsByTag).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCardsByPage', () => {
    it('should call cardsService.getCardsByPage with correct params', async () => {
      const page = '4';
      const req = { userId: 1 };

      await controller.getCardsByPage(page, req);

      expect(cardsService.getCardsByPage).toHaveBeenCalledWith(4, 1);
      expect(cardsService.getCardsByPage).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should call cardsService.getCardById with correct params', async () => {
      const id = '5';

      await controller.findOne(id, mockUser);

      expect(cardsService.getCardById).toHaveBeenCalledWith(5, mockUser.id);
      expect(cardsService.getCardById).toHaveBeenCalledTimes(1);
    });
  });
});
