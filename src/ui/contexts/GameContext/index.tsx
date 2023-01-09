import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { GameSocketConn } from '@/apis/socketConnections';
import { RangeVo, MapVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  mapSize: MapSizeVo | null;
  observedRange: RangeVo | null;
  map: MapVo | null;
  items: ItemAgg[] | null;
  joinGame: () => void;
  buildItem: (location: LocationVo, itemId: string) => void;
  destroyItem: (location: LocationVo) => void;
  observeRange: (range: RangeVo) => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'DISCONNECTED',
    mapSize: null,
    observedRange: null,
    map: null,
    items: null,
    joinGame: () => {},
    buildItem: () => {},
    destroyItem: () => {},
    observeRange: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [gameSocketConn, setGameSocketConn] = useState<GameSocketConn | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');

  const initialContextValue = createInitialContextValue();
  const [mapSize, setMapSize] = useState<MapSizeVo | null>(initialContextValue.mapSize);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [observedRange, setObservedRange] = useState<RangeVo | null>(initialContextValue.observedRange);
  const [map, setMap] = useState<MapVo | null>(initialContextValue.map);

  const reset = useCallback(() => {
    setMapSize(initialContextValue.mapSize);
    setItems(initialContextValue.items);
    setObservedRange(initialContextValue.observedRange);
    setMap(initialContextValue.map);
  }, []);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocketConn;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onGameJoined: () => {},
      onRangeObserved: (newRange: RangeVo, newMap: MapVo) => {
        setObservedRange(newRange);
        setMap(newMap);
      },
      onObservedRangeUpdated: (newRange: RangeVo, newMap: MapVo) => {
        setObservedRange(newRange);
        setMap(newMap);
      },
      onInformationUpdated: (newMapSize: MapSizeVo) => {
        setMapSize(newMapSize);
      },
      onItemsUpdated: (returnedItems: ItemAgg[]) => {
        setItems(returnedItems);
      },
      onOpen: () => {
        setGameStatus('OPEN');
      },
      onClose: (disconnectedByClient: boolean) => {
        if (disconnectedByClient) {
          setGameStatus('WAITING');
          setGameSocketConn(null);
          reset();
        } else {
          setGameStatus('DISCONNECTED');
          setGameSocketConn(null);
        }
      },
    });
    setGameStatus('CONNECTING');
    setGameSocketConn(newGameSocketConn);
  }, [gameSocketConn]);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocketConn?.disconnect();
  }, [gameSocketConn]);

  const buildItem = useCallback(
    (location: LocationVo, itemId: string) => {
      gameSocketConn?.buildItem(location, itemId);
    },
    [gameSocketConn]
  );

  const destroyItem = useCallback(
    (location: LocationVo) => {
      gameSocketConn?.destroyItem(location);
    },
    [gameSocketConn]
  );

  const observeRange = useCallback(
    debounce(
      (newRange: RangeVo) => {
        gameSocketConn?.observeRange(newRange);
      },
      150,
      { leading: true, maxWait: 500, trailing: true }
    ),
    [gameSocketConn]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          mapSize,
          observedRange,
          map,
          items,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          observeRange,
        }),
        [gameStatus, mapSize, observedRange, map, items, joinGame, leaveGame, buildItem, observeRange]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
