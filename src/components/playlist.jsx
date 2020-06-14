import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Stage from '../domain/stage';

const Wrapper = styled.div`
  background-color: ${(props) => props.backgroundColor};
  width: 100%;
`;
const StyledList = styled(List)`
  padding: 0;
  user-select: none;
`;
// https://github.com/styled-components/styled-components/issues/305#issuecomment-273794267
const StyledListItem = styled(({ isDragging, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ListItem {...rest}>{children}</ListItem>
))`
  background: ${(props) => (props.isDragging ? '#2098d1' : '#fff')};

  /* https://github.com/IanLunn/Hover/blob/master/css/hover.css#L1410 */
  vertical-align: middle;
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  position: relative;
  transition-property: color;
  transition-duration: 0.5s;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #2098d1;
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition-property: transform;
    transition-duration: 0.5s;
    transition-timing-function: ease-out;
  }
  &:hover,
  &:focus,
  &:active {
    color: white;
  }
  &:hover::before,
  &:focus::before,
  &:active::before {
    transform: scaleX(1);
    transition-timing-function: cubic-bezier(0.52, 1.64, 0.37, 0.66);
  }
`;

export default function Playlist({ list, setAudioData }) {
  const theme = useTheme();

  const changeTrack = (file) => {
    setAudioData((prev) => ({ ...prev, stage: Stage.ChangeFile, file }));
  };
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const noChange =
      destination.droppableId === source.droppableId &&
      destination.index === source.index;
    if (noChange) {
      return;
    }

    setAudioData((prev) => {
      const newList = [...prev.list];
      const [removed] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, removed);

      return { ...prev, list: newList };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper backgroundColor={theme.palette.background.paper}>
        <Droppable droppableId="playlist">
          {(droppableProvided) => (
            <StyledList
              innerRef={droppableProvided.innerRef}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...droppableProvided.droppableProps}
            >
              {list.map(({ current, file, duration }, i) => (
                <Draggable draggableId={file.name} index={i} key={file.name}>
                  {(draggableProvided, draggableSnapshot) => (
                    <StyledListItem
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...draggableProvided.draggableProps}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...draggableProvided.dragHandleProps}
                      innerRef={draggableProvided.innerRef}
                      isDragging={draggableSnapshot.isDragging}
                      selected={current}
                      onDoubleClick={() => {
                        changeTrack(file);
                      }}
                    >
                      <ListItemText primary={file.name} />
                      <Typography variant="subtitle2">{duration}</Typography>
                    </StyledListItem>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </StyledList>
          )}
        </Droppable>
      </Wrapper>
    </DragDropContext>
  );
}

Playlist.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.exact({
      current: PropTypes.bool.isRequired,
      file: PropTypes.instanceOf(File),
      duration: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  setAudioData: PropTypes.func.isRequired,
};
