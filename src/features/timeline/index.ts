/**
 * Timeline feature module
 * Handles match events and timeline visualization
 */

export interface TimelineEvent {
  minute: number;
  type: 'goal' | 'assist' | 'yellow_card' | 'red_card' | 'substitution' | 'penalty' | 'own_goal';
  player: string;
  team: 'home' | 'away';
  description: string;
}

export interface MatchTimeline {
  events: TimelineEvent[];
  duration: number;
}

export class TimelineManager {
  private timeline: MatchTimeline = { events: [], duration: 90 };

  addEvent(event: TimelineEvent): void {
    this.timeline.events.push(event);
    this.sortEvents();
  }

  removeEvent(minute: number, type: string): void {
    this.timeline.events = this.timeline.events.filter(
      event => !(event.minute === minute && event.type === type)
    );
  }

  getEvents(): TimelineEvent[] {
    return [...this.timeline.events];
  }

  getEventsByTeam(team: 'home' | 'away'): TimelineEvent[] {
    return this.timeline.events.filter(event => event.team === team);
  }

  getEventsByType(type: TimelineEvent['type']): TimelineEvent[] {
    return this.timeline.events.filter(event => event.type === type);
  }

  getEventsInPeriod(startMinute: number, endMinute: number): TimelineEvent[] {
    return this.timeline.events.filter(
      event => event.minute >= startMinute && event.minute <= endMinute
    );
  }

  private sortEvents(): void {
    this.timeline.events.sort((a, b) => a.minute - b.minute);
  }

  getMatchSummary(): { homeGoals: number; awayGoals: number; totalEvents: number } {
    const goals = this.getEventsByType('goal');
    const homeGoals = goals.filter(goal => goal.team === 'home').length;
    const awayGoals = goals.filter(goal => goal.team === 'away').length;

    return {
      homeGoals,
      awayGoals,
      totalEvents: this.timeline.events.length
    };
  }
}

export const timelineManager = new TimelineManager();
