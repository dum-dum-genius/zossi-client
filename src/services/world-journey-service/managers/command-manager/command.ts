import { DateVo } from '@/models/global/date-vo';
import { CommandParams } from './command-params';
import { CommandNameEnum } from './command-name-enum';

const emptyUndoAction = () => {};

export abstract class Command {
  protected undoAction: () => void = emptyUndoAction;

  constructor(protected name: CommandNameEnum, protected id: string, protected createdAt: DateVo, protected isRemote: boolean) {}

  public getId() {
    return this.id;
  }

  public getName(): CommandNameEnum {
    return this.name;
  }

  public getCreatedAtTimestamp() {
    return this.createdAt.getTimestamp();
  }

  public isCreatedBetween(dateA: DateVo, dateB: DateVo) {
    return this.createdAt.isBetween(dateA, dateB);
  }

  public getIsLocal() {
    return !this.isRemote;
  }

  public getIsRemote() {
    return this.isRemote;
  }

  public abstract getIsClientOnly(): boolean;

  public abstract execute(params: CommandParams): void;

  protected setUndoAction(newUndoAction: () => void) {
    this.undoAction = newUndoAction;
  }

  public undo(): void {
    this.undoAction();
    this.undoAction = emptyUndoAction;
  }
}
