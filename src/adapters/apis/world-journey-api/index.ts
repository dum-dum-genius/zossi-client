import { parseCommandDto, toCommandDto } from './commands';
import { WorldModel } from '@/models/world/world/world-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { AuthSessionStorage } from '@/adapters/storages/auth-session-storage';
import { WorldJourneyService } from '@/services/world-journey-service';
import { ServerEvent, ServerEventNameEnum, WorldEnteredServerEvent } from './server-events';
import { Command } from '@/services/world-journey-service/managers/command-manager/command';
import { parseWorldDto } from '../dtos/world-dto';
import { parseUnitDto } from '../dtos/unit-dto';
import { parsePlayerDto } from '../dtos/player-dto';
import { ClientEventNameEnum, CommandRequestedClientEvent, PingClientEvent } from './client-events';

function parseWorldEnteredServerEvent(
  event: WorldEnteredServerEvent
): [WorldModel, UnitModel[], string, PlayerModel[]] {
  return [
    parseWorldDto(event.world),
    event.units.map(parseUnitDto),
    event.myPlayerId,
    event.players.map(parsePlayerDto),
  ];
}

export class WorldJourneyApi {
  private socket: WebSocket;

  private disconnectedByUser: boolean = false;

  constructor(
    worldId: string,
    events: {
      onWorldEntered: (worldJourneyService: WorldJourneyService) => void;
      onCommandSucceeded: (command: Command) => void;
      onErrored: (message: string) => void;
      onDisconnect: () => void;
      onOpen: () => void;
    }
  ) {
    const authSessionStorage = AuthSessionStorage.get();
    const accessToken = authSessionStorage.getAccessToken();

    const socketUrl = `${process.env.API_SOCKET_URL}/api/world-journey/?id=${worldId}&access-token=${accessToken}`;
    const socket = new WebSocket(socketUrl, []);

    let pingServerInterval: NodeJS.Timer | null = null;

    socket.onmessage = async ({ data }: any) => {
      const eventJsonString: string = await data.text();
      const event: ServerEvent = JSON.parse(eventJsonString);

      console.log(event);
      if (event.name === ServerEventNameEnum.WorldEntered) {
        const [world, units, myPlayerId, players] = parseWorldEnteredServerEvent(event);
        const worldJourneyService = WorldJourneyService.new(world, players, myPlayerId, units);
        events.onWorldEntered(worldJourneyService);
      } else if (event.name === ServerEventNameEnum.CommandSucceeded) {
        const command = parseCommandDto(event.command);
        if (!command) return;
        events.onCommandSucceeded(command);
      } else if (event.name === ServerEventNameEnum.CommandFailed) {
        events.onErrored(event.errorMessage);
      } else if (event.name === ServerEventNameEnum.Errored) {
        events.onErrored(event.message);
      }
    };

    socket.onclose = () => {
      if (pingServerInterval) {
        clearInterval(pingServerInterval);
      }
      if (!this.disconnectedByUser) {
        events.onDisconnect();
      }
    };

    socket.onopen = () => {
      pingServerInterval = setInterval(() => {
        this.ping();
      }, 10000);
      events.onOpen();
    };

    this.socket = socket;

    // @ts-expect-error
    window.sendCommand = this.sendCommand.bind(this);
  }

  static new(
    worldId: string,
    events: {
      onWorldEntered: (worldJourneyService: WorldJourneyService) => void;
      onCommandSucceeded: (command: Command) => void;
      onErrored: (message: string) => void;
      onDisconnect: () => void;
      onOpen: () => void;
    }
  ): WorldJourneyApi {
    return new WorldJourneyApi(worldId, events);
  }

  public disconnect() {
    this.disconnectedByUser = true;
    this.socket.close();
  }

  private async sendMessage(msg: object) {
    console.log(msg);
    const jsonString = JSON.stringify(msg);
    const jsonBlob = new Blob([jsonString]);

    if (this.socket.readyState !== this.socket.OPEN) {
      return;
    }
    this.socket.send(jsonBlob);
  }

  public ping() {
    const clientEvent: PingClientEvent = {
      name: ClientEventNameEnum.Ping,
    };
    this.sendMessage(clientEvent);
  }

  public sendCommand(command: Command) {
    const commandDto = toCommandDto(command);
    if (!commandDto) return;

    const clientEvent: CommandRequestedClientEvent = {
      name: ClientEventNameEnum.CommandRequested,
      command: commandDto,
    };

    this.sendMessage(clientEvent);
  }
}
