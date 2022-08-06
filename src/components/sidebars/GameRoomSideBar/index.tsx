import { useState } from 'react';
import { CoordinateEntity } from '@/entities';
import SmallLogo from '@/components/logos/SmallLogo/';
import UnitPatternIcon from '@/components/icons/UnitPatternIcon';
import EditRelativeCoordinatesModal from '@/components/modals/EditRelativeCoordinatesModal';
import ItemWrapper from './subComponents/ItemWrapper';
import dataTestids from './dataTestids';

type HoverStateFlags = {
  unitMap: boolean;
};

type Props = {
  onLogoClick: () => void;
  relativeCoordinates: CoordinateEntity[];
  onRelativeCoordinatesUpdate: (coordinates: CoordinateEntity[]) => void;
};

function GameRoomSideBar({ onLogoClick, relativeCoordinates, onRelativeCoordinatesUpdate }: Props) {
  const [hoverStateFlags, setHoverStateFlags] = useState<HoverStateFlags>({
    unitMap: false,
  });

  function handleHoverStateChange(key: 'unitMap', hovered: boolean) {
    const newFlags = { ...hoverStateFlags };
    newFlags[key] = hovered;
    setHoverStateFlags(newFlags);
  }

  const [isUnitsPatternVisible, setIsUnitsPatternVisible] = useState<boolean>(false);
  const handleUnitsPatternItemClick = () => {
    setIsUnitsPatternVisible(true);
  };
  const handleUnitsPatternUpdate = (coordinates: CoordinateEntity[]) => {
    onRelativeCoordinatesUpdate(coordinates);
    setIsUnitsPatternVisible(false);
  };

  return (
    <section
      data-testid={dataTestids.root}
      style={{
        width: '90px',
        height: '100%',
        display: 'flex',
        flexFlow: 'column',
        backgroundColor: '#1C1C1C',
      }}
    >
      <ItemWrapper hovered={false} width="100%" height="70px" onClick={onLogoClick}>
        <SmallLogo />
      </ItemWrapper>
      <ItemWrapper
        width="100%"
        height="70px"
        hovered={hoverStateFlags.unitMap}
        onHoverStateChange={(hovered) => {
          handleHoverStateChange('unitMap', hovered);
        }}
        onClick={handleUnitsPatternItemClick}
      >
        <UnitPatternIcon highlighted={hoverStateFlags.unitMap} active={false} />
      </ItemWrapper>
      <EditRelativeCoordinatesModal
        opened={isUnitsPatternVisible}
        relativeCoordinates={relativeCoordinates}
        onPatternUpdate={handleUnitsPatternUpdate}
      />
    </section>
  );
}

export default GameRoomSideBar;
export { dataTestids };
