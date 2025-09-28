import { describe, it, expect, beforeEach } from 'vitest';
import { teamsManager } from '@/features/teams';
import { playersManager } from '@/features/players';
import { matchesManager } from '@/features/matches';
import { lineupManager } from '@/features/lineup';
import { tacticsAnalyzer } from '@/features/tactics';
import { timelineManager } from '@/features/timeline';

describe('Teams Manager', () => {
  beforeEach(() => {
    // Clear teams before each test
    const teams = teamsManager.getAllTeams();
    teams.forEach(_team => {
      // Note: We'd need to add a removeTeam method to properly clear
      // For now, we'll work with the existing state
    });
  });

  it('should add and retrieve teams', () => {
    const team = {
      id: 'test-team',
      name: 'Test Team',
      shortName: 'TEST',
      colors: { primary: '#FF0000', secondary: '#0000FF' },
      stats: {
        position: 1,
        points: 30,
        played: 10,
        won: 10,
        drawn: 0,
        lost: 0,
        goalsFor: 25,
        goalsAgainst: 5,
        goalDifference: 20,
        form: ['W', 'W', 'W', 'W', 'W'] as ("W" | "D" | "L")[]
      }
    };

    teamsManager.addTeam(team);
    const retrievedTeam = teamsManager.getTeam('test-team');
    
    expect(retrievedTeam).toEqual(team);
  });

  it('should return Big 6 teams', () => {
    // Add some Big 6 teams
    const liverpool = {
      id: 'liverpool',
      name: 'Liverpool FC',
      shortName: 'LIV',
      colors: { primary: '#C8102E', secondary: '#00B2A9' },
      stats: {
        position: 1, points: 15, played: 5, won: 5, drawn: 0, lost: 0,
        goalsFor: 12, goalsAgainst: 2, goalDifference: 10, form: ["W", "W", "W", "W", "W"] as ("W" | "D" | "L")[]
      }
    };

    teamsManager.addTeam(liverpool);
    const big6Teams = teamsManager.getBig6Teams();
    
    expect(big6Teams).toContainEqual(liverpool);
  });

  it('should compare teams correctly', () => {
    const team1 = {
      id: 'team1', name: 'Team 1', shortName: 'T1',
      colors: { primary: '#FF0000', secondary: '#0000FF' },
      stats: { position: 1, points: 30, played: 10, won: 10, drawn: 0, lost: 0,
        goalsFor: 25, goalsAgainst: 5, goalDifference: 20, form: ['W'] as ("W" | "D" | "L")[] }
    };

    const team2 = {
      id: 'team2', name: 'Team 2', shortName: 'T2',
      colors: { primary: '#00FF00', secondary: '#FF00FF' },
      stats: { position: 2, points: 25, played: 10, won: 8, drawn: 1, lost: 1,
        goalsFor: 20, goalsAgainst: 8, goalDifference: 12, form: ['W'] as ("W" | "D" | "L")[] }
    };

    teamsManager.addTeam(team1);
    teamsManager.addTeam(team2);

    const comparison = teamsManager.compareTeams('team1', 'team2');
    
    expect(comparison).not.toBeNull();
    expect(comparison!.comparison.position).toBe('team1');
    expect(comparison!.comparison.points).toBe('team1');
  });
});

describe('Players Manager', () => {
  it('should add and retrieve players', () => {
    const player = {
      id: 'test-player',
      name: 'Test Player',
      position: 'ST' as const,
      nationality: 'England',
      age: 25,
      teamId: 'test-team',
      stats: {
        season: '2025-26',
        appearances: 10,
        starts: 8,
        minutesPlayed: 720,
        goals: 5,
        assists: 3,
        yellowCards: 1,
        redCards: 0
      }
    };

    playersManager.addPlayer(player);
    const retrievedPlayer = playersManager.getPlayer('test-player');
    
    expect(retrievedPlayer).toEqual(player);
  });

  it('should get top scorers', () => {
    const player1 = {
      id: 'player1', name: 'Player 1', position: 'ST' as const,
      nationality: 'England', age: 25, teamId: 'team1',
      stats: { season: '2025-26', appearances: 10, starts: 8, minutesPlayed: 720,
        goals: 10, assists: 3, yellowCards: 1, redCards: 0 }
    };

    const player2 = {
      id: 'player2', name: 'Player 2', position: 'ST' as const,
      nationality: 'Spain', age: 27, teamId: 'team2',
      stats: { season: '2025-26', appearances: 10, starts: 9, minutesPlayed: 810,
        goals: 8, assists: 2, yellowCards: 0, redCards: 0 }
    };

    playersManager.addPlayer(player1);
    playersManager.addPlayer(player2);

    const topScorers = playersManager.getTopScorers(2);
    
    expect(topScorers).toHaveLength(2);
    expect(topScorers[0].stats.goals).toBeGreaterThanOrEqual(topScorers[1].stats.goals);
  });

  it('should filter players by position', () => {
    const striker = {
      id: 'striker', name: 'Striker', position: 'ST' as const,
      nationality: 'England', age: 25, teamId: 'team1',
      stats: { season: '2025-26', appearances: 10, starts: 8, minutesPlayed: 720,
        goals: 5, assists: 3, yellowCards: 1, redCards: 0 }
    };

    const midfielder = {
      id: 'midfielder', name: 'Midfielder', position: 'CM' as const,
      nationality: 'Spain', age: 27, teamId: 'team1',
      stats: { season: '2025-26', appearances: 10, starts: 9, minutesPlayed: 810,
        goals: 2, assists: 8, yellowCards: 2, redCards: 0 }
    };

    playersManager.addPlayer(striker);
    playersManager.addPlayer(midfielder);

    const strikers = playersManager.getPlayersByPosition('ST');
    const midfielders = playersManager.getPlayersByPosition('CM');
    
    expect(strikers).toContainEqual(striker);
    expect(midfielders).toContainEqual(midfielder);
    expect(strikers).not.toContainEqual(midfielder);
  });
});

describe('Matches Manager', () => {
  it('should add and retrieve matches', () => {
    const match = {
      id: 'test-match',
      date: '2025-09-22T15:00:00Z',
      homeTeamId: 'liverpool',
      awayTeamId: 'arsenal',
      competition: { name: 'Premier League', season: '2025-26', gameweek: 5 },
      venue: { name: 'Anfield', city: 'Liverpool' },
      status: 'scheduled' as const
    };

    matchesManager.addMatch(match);
    const retrievedMatch = matchesManager.getMatch('test-match');
    
    expect(retrievedMatch).toEqual(match);
  });

  it('should get matches by team', () => {
    const match1 = {
      id: 'match1', date: '2025-09-22T15:00:00Z',
      homeTeamId: 'liverpool', awayTeamId: 'arsenal',
      competition: { name: 'Premier League', season: '2025-26' },
      venue: { name: 'Anfield', city: 'Liverpool' },
      status: 'scheduled' as const
    };

    const match2 = {
      id: 'match2', date: '2025-09-29T15:00:00Z',
      homeTeamId: 'chelsea', awayTeamId: 'liverpool',
      competition: { name: 'Premier League', season: '2025-26' },
      venue: { name: 'Stamford Bridge', city: 'London' },
      status: 'scheduled' as const
    };

    matchesManager.addMatch(match1);
    matchesManager.addMatch(match2);

    const liverpoolMatches = matchesManager.getMatchesByTeam('liverpool');
    
    expect(liverpoolMatches).toHaveLength(2);
    expect(liverpoolMatches).toContainEqual(match1);
    expect(liverpoolMatches).toContainEqual(match2);
  });

  it('should update match scores', () => {
    const match = {
      id: 'score-test', date: '2025-09-22T15:00:00Z',
      homeTeamId: 'liverpool', awayTeamId: 'arsenal',
      competition: { name: 'Premier League', season: '2025-26' },
      venue: { name: 'Anfield', city: 'Liverpool' },
      status: 'live' as const
    };

    matchesManager.addMatch(match);
    matchesManager.updateMatchScore('score-test', { home: 2, away: 1 });

    const updatedMatch = matchesManager.getMatch('score-test');
    
    expect(updatedMatch?.score).toEqual({ home: 2, away: 1 });
    expect(updatedMatch?.status).toBe('finished');
  });
});

describe('Lineup Manager', () => {
  it('should set and get formation', () => {
    const formation = {
      name: '4-3-3',
      positions: [
        { x: 50, y: 10, playerId: 'gk1' },
        { x: 20, y: 30, playerId: 'def1' },
        { x: 40, y: 30, playerId: 'def2' }
      ]
    };

    lineupManager.setFormation(formation);
    const retrievedFormation = lineupManager.getFormation();
    
    expect(retrievedFormation).toEqual(formation);
  });

  it('should validate formation positions', () => {
    const validFormation = {
      name: '4-3-3',
      positions: [{ x: 50, y: 50, playerId: 'player1' }]
    };

    const invalidFormation = {
      name: '4-3-3',
      positions: [{ x: 150, y: 50, playerId: 'player1' }] // x > 100
    };

    expect(lineupManager.validateFormation(validFormation)).toBe(true);
    expect(lineupManager.validateFormation(invalidFormation)).toBe(false);
  });
});

describe('Tactics Analyzer', () => {
  it('should analyze tactical setup', () => {
    const setup = tacticsAnalyzer.analyzeTacticalSetup('liverpool');
    
    expect(setup).toHaveProperty('formation');
    expect(setup).toHaveProperty('playingStyle');
    expect(setup).toHaveProperty('strengths');
    expect(setup).toHaveProperty('weaknesses');
  });

  it('should compare team tactics', () => {
    const comparison = tacticsAnalyzer.compareTactics('liverpool', 'arsenal');
    
    expect(comparison).toHaveProperty('homeTeam');
    expect(comparison).toHaveProperty('awayTeam');
    expect(comparison).toHaveProperty('keyBattles');
    expect(comparison).toHaveProperty('prediction');
  });

  it('should get formation strengths', () => {
    const strengths433 = tacticsAnalyzer.getFormationStrengths('4-3-3');
    const strengths442 = tacticsAnalyzer.getFormationStrengths('4-4-2');
    
    expect(strengths433).toContain('Width in attack');
    expect(strengths442).toContain('Direct play');
  });
});

describe('Timeline Manager', () => {
  beforeEach(() => {
    // Reset timeline before each test
    const events = timelineManager.getEvents();
    events.forEach(event => {
      timelineManager.removeEvent(event.minute, event.type);
    });
  });

  it('should add and retrieve events', () => {
    const event = {
      minute: 25,
      type: 'goal' as const,
      player: 'Salah',
      team: 'home' as const,
      description: 'Great finish from Salah'
    };

    timelineManager.addEvent(event);
    const events = timelineManager.getEvents();
    
    expect(events).toContainEqual(event);
  });

  it('should sort events by minute', () => {
    const event1 = {
      minute: 45, type: 'goal' as const, player: 'Player1',
      team: 'home' as const, description: 'Goal 1'
    };
    const event2 = {
      minute: 25, type: 'goal' as const, player: 'Player2',
      team: 'away' as const, description: 'Goal 2'
    };

    timelineManager.addEvent(event1);
    timelineManager.addEvent(event2);

    const events = timelineManager.getEvents();
    
    expect(events[0].minute).toBeLessThanOrEqual(events[1].minute);
  });

  it('should get match summary', () => {
    timelineManager.addEvent({
      minute: 25, type: 'goal', player: 'Player1',
      team: 'home', description: 'Home goal'
    });
    timelineManager.addEvent({
      minute: 45, type: 'goal', player: 'Player2',
      team: 'away', description: 'Away goal'
    });
    timelineManager.addEvent({
      minute: 60, type: 'yellow_card', player: 'Player3',
      team: 'home', description: 'Yellow card'
    });

    const summary = timelineManager.getMatchSummary();
    
    expect(summary.homeGoals).toBe(1);
    expect(summary.awayGoals).toBe(1);
    expect(summary.totalEvents).toBe(3);
  });
});
