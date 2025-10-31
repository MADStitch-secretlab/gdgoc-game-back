import { IsIn, IsInt, IsNotEmpty, IsObject, IsOptional, IsPositive, IsString, Length, Min } from 'class-validator';

export type Difficulty = 'easy' | 'medium' | 'hard';

export class CreateReactionDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  nick!: string;

  @IsString()
  @IsIn(['easy', 'medium', 'hard'])
  difficulty!: Difficulty;

  @IsInt()
  @IsPositive()
  @Min(1)
  timeMs!: number;

  @IsOptional()
  @IsObject()
  meta?: {
    roundId?: string;
    clientTs?: number;
  };
}

export interface ReactionRecord {
  nick: string;
  difficulty: Difficulty;
  timeMs: number;
  at: number; // epoch ms when saved
}


