import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { DateVo } from '@/models/general/date-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';

export class ChangePlayerActionCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private action: PlayerActionVo;

  constructor(id: string, timestamp: number, playerId: string, action: PlayerActionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.action = action;
  }

  static new(playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(uuidv4(), DateVo.now().getTimestamp(), playerId, action);
  }

  static load(id: string, timestamp: number, playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(id, timestamp, playerId, action);
  }

  public execute({ playerStorage }: CommandParams): void {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();
    clonedPlayer.updateAction(this.action);
    clonedPlayer.updatePosition(this.action.getPosition());
    playerStorage.updatePlayer(clonedPlayer);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getAction() {
    return this.action;
  }
}
