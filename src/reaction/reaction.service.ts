import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateReactionDto, Difficulty, ReactionRecord } from './dto/create-reaction.dto';

type UserAggregate = {
  nick: string;
  bestMs: number;
  attempts: number;
  lastAt: number;
};

@Injectable()
export class ReactionService {
  private readonly store: ReactionRecord[] = [];

  saveReaction(dto: CreateReactionDto): { saved: ReactionRecord; ranking: { difficulty: Difficulty; count: number; bestMs: number; percentile: number } } {
    if (!['easy', 'medium', 'hard'].includes(dto.difficulty)) {
      throw new BadRequestException('Invalid difficulty or timeMs');
    }
    if (!(dto.timeMs > 0) || dto.timeMs > 60000) {
      throw new BadRequestException('Invalid difficulty or timeMs');
    }

    const saved: ReactionRecord = {
      nick: dto.nick,
      difficulty: dto.difficulty,
      timeMs: Math.floor(dto.timeMs),
      at: Date.now(),
    };
    this.store.push(saved);

    const agg = this.getAggregatedRanking(dto.difficulty);
    const bestMs = agg.length > 0 ? agg[0].bestMs : saved.timeMs;
    const userIndex = agg.findIndex((u) => u.nick === dto.nick);
    const percentile = this.calcPercentile(userIndex, agg.length);

    return {
      saved,
      ranking: {
        difficulty: dto.difficulty,
        count: agg.length,
        bestMs,
        percentile,
      },
    };
  }

  getRank(difficulty: Difficulty, limit = 10) {
    if (!difficulty) {
      throw new BadRequestException('difficulty is required');
    }
    const agg = this.getAggregatedRanking(difficulty);
    return {
      difficulty,
      limit,
      total: agg.length,
      items: agg.slice(0, Math.max(1, Math.min(100, limit))).map((u) => ({
        nick: u.nick,
        bestMs: u.bestMs,
        attempts: u.attempts,
        lastAt: u.lastAt,
      })),
    };
  }

  private getAggregatedRanking(difficulty: Difficulty): UserAggregate[] {
    const filtered = this.store.filter((r) => r.difficulty === difficulty);
    const byNick = new Map<string, UserAggregate>();
    for (const r of filtered) {
      const prev = byNick.get(r.nick);
      if (!prev) {
        byNick.set(r.nick, { nick: r.nick, bestMs: r.timeMs, attempts: 1, lastAt: r.at });
      } else {
        prev.bestMs = Math.min(prev.bestMs, r.timeMs);
        prev.attempts += 1;
        prev.lastAt = Math.max(prev.lastAt, r.at);
      }
    }
    const arr = Array.from(byNick.values());
    arr.sort((a, b) => a.bestMs - b.bestMs || a.lastAt - b.lastAt);
    return arr;
  }

  private calcPercentile(index: number, total: number): number {
    if (total <= 0 || index < 0) return 100;
    const rankPosition = index + 1; // 1-based rank
    const percentile = (rankPosition / total) * 100;
    return Math.round(percentile * 10) / 10;
  }
}


