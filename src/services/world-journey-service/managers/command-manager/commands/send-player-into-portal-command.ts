import { Command } from '../command';
import { DateVo } from '@/models/global/date-vo';
import { CommandParams } from '../command-params';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class SendPlayerIntoPortalCommand extends Command {
  constructor(id: string, timestamp: number, isRemote: boolean, private playerId: string, private unitId: string) {
    super(id, timestamp, isRemote);
  }

  static create(playerId: string, unitId: string) {
    return new SendPlayerIntoPortalCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, playerId, unitId);
  }

  static createRemote(id: string, timestamp: number, playerId: string, unitId: string) {
    return new SendPlayerIntoPortalCommand(id, timestamp, true, playerId, unitId);
  }

  public getIsClientOnly = () => true;

  public getIsReplayable = () => false;

  public execute({ unitManager, playerManager }: CommandParams): void {
    const portalUnit = unitManager.getUnit(this.unitId);
    if (!portalUnit || !(portalUnit instanceof PortalUnitModel)) return;

    const targetUnitId = portalUnit.getTargetUnitId();
    if (!targetUnitId) return;

    const targetUnit = unitManager.getUnit(targetUnitId);
    if (!targetUnit) return;

    const currentPlayer = playerManager.getPlayer(this.playerId);
    if (!currentPlayer) return;

    const targetPosition = targetUnit.getPosition();

    const clonedPlayer = currentPlayer.clone();
    const nextPlayerPrecisePosition = PrecisePositionVo.create(targetPosition.getX(), targetPosition.getZ());
    clonedPlayer.updatePrecisePosition(nextPlayerPrecisePosition);

    const isPlayerUpdated = playerManager.updatePlayer(clonedPlayer);

    this.setUndoAction(() => {
      if (isPlayerUpdated) {
        playerManager.updatePlayer(currentPlayer);
      }
    });
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getUnitId() {
    return this.unitId;
  }
}
