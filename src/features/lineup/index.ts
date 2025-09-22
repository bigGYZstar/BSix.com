/**
 * Lineup feature module
 * Handles team formation and player positioning
 */

export interface LineupPosition {
  x: number;
  y: number;
  playerId: string;
}

export interface Formation {
  name: string;
  positions: LineupPosition[];
}

export class LineupManager {
  private formation: Formation | null = null;

  setFormation(formation: Formation): void {
    this.formation = formation;
  }

  getFormation(): Formation | null {
    return this.formation;
  }

  getPlayerPosition(playerId: string): LineupPosition | null {
    if (!this.formation) return null;
    return this.formation.positions.find(pos => pos.playerId === playerId) || null;
  }

  validateFormation(formation: Formation): boolean {
    // Basic validation - ensure positions are within field bounds
    return formation.positions.every(pos => 
      pos.x >= 0 && pos.x <= 100 && 
      pos.y >= 0 && pos.y <= 140
    );
  }
}

export const lineupManager = new LineupManager();
