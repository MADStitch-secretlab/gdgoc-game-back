import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import type { Difficulty } from './dto/create-reaction.dto';

@Controller()
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('reaction')
  create(@Body() dto: CreateReactionDto) {
    const result = this.reactionService.saveReaction(dto);
    return {
      status: 'ok',
      saved: result.saved,
      ranking: result.ranking,
    };
  }

  @Get('rank')
  findRank(
    @Query('difficulty') difficulty: Difficulty,
    @Query('limit') limit?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.reactionService.getRank(difficulty, isNaN(parsedLimit) ? 10 : parsedLimit);
  }
}


