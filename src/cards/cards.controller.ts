import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  UseGuards,
  SerializeOptions,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CardsService } from './cards.service';
import { LikesService } from '../likes/likes.service';

import { User } from '../users/entities/user.entity';
import { GROUP_USER } from '../base-entity';

import { JwtGuard } from '../common/guards/jwt.guard';
import { CustomJwtGuard } from '../common/guards/custom.jwt.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

/**
 * Controller for managing card operations.
 * Handles CRUD operations for cards and related actions like liking/disliking.
 * Requires JWT authentication for all endpoints.
 * Uses ClassSerializerInterceptor for response serialization.
 */
@Controller('cards')
@UseInterceptors(ClassSerializerInterceptor)
export class CardsController {
  /**
   * Constructor initializing service dependencies
   * @param cardsService Service for handling card operations
   * @param likesService Service for handling card likes
   */
  constructor(
    private readonly cardsService: CardsService,
    private readonly likesService: LikesService,
  ) {}

  /**
   * Creates a new card
   * @param createCardDto DTO containing card creation data
   * @param req Request object containing authenticated user
   * @returns Created card
   */
  @ApiOperation({
    summary: 'Create card',
  })
  @UseGuards(JwtGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Card created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createCardDto: CreateCardDto, @CurrentUser() user: User) {
    return this.cardsService.create(createCardDto, user);
  }

  /**
   * Retrieves all cards
   * @returns Array of cards
   */
  @ApiOperation({
    summary: 'Get cards',
  })
  @UseGuards(CustomJwtGuard)
  @Get()
  @SerializeOptions({
    groups: [GROUP_USER],
  })
  @ApiResponse({ status: 200, description: 'Cards retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: { userId: number }) {
    return await this.cardsService.findAll(req.userId);
  }

  /**
   * Updates an existing card
   * @param id ID of the card to update
   * @param updateCardDto DTO containing updated card data
   * @returns Updated card
   */
  @Patch(':id')
  @ApiResponse({ status: 200, description: 'Card updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto);
  }

  /**
   * Adds a like to a card
   * @param id ID of the card to like
   * @param req Request object containing authenticated user
   * @returns Like operation result
   */
  @UseGuards(JwtGuard)
  @Put(':id/likes')
  async like(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.cardsService.likeCard({ id: +id }, user);
  }

  /**
   * Removes a like from a card
   * @param id ID of the card to dislike
   * @param req Request object containing authenticated user
   * @returns Dislike operation result
   */
  @UseGuards(JwtGuard)
  @Delete(':id/likes')
  async dislike(@Param('id') id: string, @CurrentUser() user: User) {
    // return this.likesService.dislike({ card: { id: +id }, user: req.user });
    return await this.cardsService.dislikeCard({ id: +id }, user);
  }

  /**
   * Deletes a card by ID
   * @param id ID of the card to delete
   * @returns Deletion result
   */
  @ApiOperation({
    summary: 'Delete card by ID',
  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.cardsService.remove(+id, user);
  }

  @UseGuards(JwtGuard)
  @Get('count/:id')
  async getCount(@Param('id') id: string) {
    return this.cardsService.getCount(+id);
  }

  @UseGuards(JwtGuard)
  @Get('user/:userId/page/:page')
  async getCardsByUser(
    @Param('userId') userId: string,
    @Param('page') page: string,
    @Req() req: { user: User },
  ) {
    return this.cardsService.getCardsByUser(+userId, +page, req.user);
  }

  @UseGuards(JwtGuard)
  @Get('tag/:tagName/page/:page')
  async getCardsByTag(
    @Param('tagName') tagName: string,
    @Param('page') page: string,
    @Req() req: { user: User },
  ) {
    return this.cardsService.getCardsByTag(tagName, +page, req.user);
  }

  @UseGuards(CustomJwtGuard)
  @Get('page/:page')
  async getCardsByPage(
    @Param('page') page: string,
    @Req() req: { userId: number },
  ) {
    return this.cardsService.getCardsByPage(+page, req.userId);
  }

  /**
   * Finds a card by ID
   * @param id ID of the card to find
   * @returns Found card
   */
  @ApiOperation({
    summary: 'Get card by ID',
  })
  @UseGuards(JwtGuard)
  @Get(':id')
  @ApiResponse({ status: 200, description: 'Card retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Card not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.cardsService.getCardById(+id, user.id);
  }
}
