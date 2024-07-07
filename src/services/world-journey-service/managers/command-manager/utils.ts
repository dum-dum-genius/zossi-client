import { Command } from './command';
import { CommandNameEnum } from './command-name-enum';
import { AddItemCommand } from './commands/add-item-command';
import { AddPlayerCommand } from './commands/add-player-command';
import { ChangePlayerActionCommand } from './commands/change-player-action-command';
import { ChangePlayerHeldItemCommand } from './commands/change-player-held-item-command';
import { ChangePlayerPrecisePositionCommand } from './commands/change-player-precise-position-command';
import { CreateEmbedUnitCommand } from './commands/create-embed-unit-command';
import { CreateFenceUnitCommand } from './commands/create-fence-unit-command';
import { CreateLinkUnitCommand } from './commands/create-link-unit-command';
import { CreatePortalUnitCommand } from './commands/create-portal-unit-command';
import { CreateStaticUnitCommand } from './commands/create-static-unit-command';
import { RemoveEmbedUnitCommand } from './commands/remove-embed-unit-command';
import { RemoveFenceUnitCommand } from './commands/remove-fence-unit-command';
import { RemoveLinkUnitCommand } from './commands/remove-link-unit-command';
import { RemovePlayerCommand } from './commands/remove-player-command';
import { RemovePortalUnitCommand } from './commands/remove-portal-unit-command';
import { RemoveStaticUnitCommand } from './commands/remove-static-unit-command';
import { RotateUnitCommand } from './commands/rotate-unit-command';
import { SendPlayerIntoPortalCommand } from './commands/send-player-into-portal-command';

/**
 * This function is mainly for making sure you handle every type of command
 */
export const dispatchCommand = <T>(
  command: Command,
  mapper: {
    [CommandNameEnum.AddItem]: (_unit: AddItemCommand) => T;
    [CommandNameEnum.AddPlayer]: (_unit: AddPlayerCommand) => T;
    [CommandNameEnum.ChangePlayerAction]: (_unit: ChangePlayerActionCommand) => T;
    [CommandNameEnum.ChangePlayerHeldItem]: (_unit: ChangePlayerHeldItemCommand) => T;
    [CommandNameEnum.ChangePlayerPrecisePosition]: (_unit: ChangePlayerPrecisePositionCommand) => T;
    [CommandNameEnum.CreateEmbedUnit]: (_unit: CreateEmbedUnitCommand) => T;
    [CommandNameEnum.CreateFenceUnit]: (_unit: CreateFenceUnitCommand) => T;
    [CommandNameEnum.CreateLinkUnit]: (_unit: CreateLinkUnitCommand) => T;
    [CommandNameEnum.CreatePortalUnit]: (_unit: CreatePortalUnitCommand) => T;
    [CommandNameEnum.CreateStaticUnit]: (_unit: CreateStaticUnitCommand) => T;
    [CommandNameEnum.RemoveEmbedUnit]: (_unit: RemoveEmbedUnitCommand) => T;
    [CommandNameEnum.RemoveFenceUnit]: (_unit: RemoveFenceUnitCommand) => T;
    [CommandNameEnum.RemoveLinkUnit]: (_unit: RemoveLinkUnitCommand) => T;
    [CommandNameEnum.RemovePlayer]: (_unit: RemovePlayerCommand) => T;
    [CommandNameEnum.RemovePortalUnit]: (_unit: RemovePortalUnitCommand) => T;
    [CommandNameEnum.RemoveStaticUnit]: (_unit: RemoveStaticUnitCommand) => T;
    [CommandNameEnum.RotateUnit]: (_unit: RotateUnitCommand) => T;
    [CommandNameEnum.SendPlayerIntoPortal]: (_unit: SendPlayerIntoPortalCommand) => T;
  }
): T => {
  if (command instanceof AddItemCommand) {
    return mapper[CommandNameEnum.AddItem](command);
  } else if (command instanceof AddPlayerCommand) {
    return mapper[CommandNameEnum.AddPlayer](command);
  } else if (command instanceof ChangePlayerActionCommand) {
    return mapper[CommandNameEnum.ChangePlayerAction](command);
  } else if (command instanceof ChangePlayerHeldItemCommand) {
    return mapper[CommandNameEnum.ChangePlayerHeldItem](command);
  } else if (command instanceof ChangePlayerPrecisePositionCommand) {
    return mapper[CommandNameEnum.ChangePlayerPrecisePosition](command);
  } else if (command instanceof CreateFenceUnitCommand) {
    return mapper[CommandNameEnum.CreateFenceUnit](command);
  } else if (command instanceof CreatePortalUnitCommand) {
    return mapper[CommandNameEnum.CreatePortalUnit](command);
  } else if (command instanceof CreateStaticUnitCommand) {
    return mapper[CommandNameEnum.CreateStaticUnit](command);
  } else if (command instanceof RemoveEmbedUnitCommand) {
    return mapper[CommandNameEnum.RemoveEmbedUnit](command);
  } else if (command instanceof RemoveFenceUnitCommand) {
    return mapper[CommandNameEnum.RemoveFenceUnit](command);
  } else if (command instanceof RemoveLinkUnitCommand) {
    return mapper[CommandNameEnum.RemoveLinkUnit](command);
  } else if (command instanceof RemovePlayerCommand) {
    return mapper[CommandNameEnum.RemovePlayer](command);
  } else if (command instanceof RemovePortalUnitCommand) {
    return mapper[CommandNameEnum.RemovePortalUnit](command);
  } else if (command instanceof RemoveStaticUnitCommand) {
    return mapper[CommandNameEnum.RemoveStaticUnit](command);
  } else if (command instanceof RotateUnitCommand) {
    return mapper[CommandNameEnum.RotateUnit](command);
  } else if (command instanceof SendPlayerIntoPortalCommand) {
    return mapper[CommandNameEnum.SendPlayerIntoPortal](command);
  }
  throw new Error(`The command name ${command.getName()} is not handled here`);
};
