import { Command } from './commands/command';
import { CommandParams } from './commands/command-params';

export type CommandExecutedHandler = (command: Command) => void;

export class CommandManager {
  private commandExecutedHandlers: CommandExecutedHandler[] = [];

  private commandMap: Record<string, Command>;

  constructor() {
    this.commandExecutedHandlers = [];

    this.commandMap = {};
  }

  static new() {
    return new CommandManager();
  }

  public getCommand(id: string): Command {
    return this.commandMap[id];
  }

  public addCommand(command: Command) {
    this.commandMap[command.getId()] = command;
  }

  public executeCommand(command: Command, params: CommandParams): boolean {
    const commandId = command.getId();
    const duplicatedCommand = this.getCommand(commandId);
    if (duplicatedCommand) return false;

    const succeeded = command.execute(params);
    this.addCommand(command);

    this.publishCommandExecuted(command);

    return succeeded;
  }

  public publishCommandExecuted(command: Command) {
    this.commandExecutedHandlers.forEach((hdl) => {
      hdl(command);
    });
  }

  public subscribeCommandExecuted(handler: CommandExecutedHandler) {
    this.commandExecutedHandlers.push(handler);

    return () => {
      this.commandExecutedHandlers = this.commandExecutedHandlers.filter((hdl) => hdl !== handler);
    };
  }
}
