import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: ${(props) => props.backgroundColor};
  width: 100%;
`;
// https://github.com/styled-components/styled-components/issues/305#issuecomment-273794267
const StyledList = styled(({ isDraggingOver, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <List {...rest}>{children}</List>
))`
  background-color: ${(props) => (props.isDraggingOver ? 'skyblue' : '#fff')};
  padding: 0;
  user-select: none;
`;
const StyledListItem = styled(({ isDragging, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <ListItem {...rest}>{children}</ListItem>
))`
  background-color: ${(props) => (props.isDragging ? 'lightgreen' : '#fff')};
`;

export default function Playlist({ list, setAudioData }) {
  const theme = useTheme();
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
          {(droppableProvided, droppableSnapshot) => (
            <StyledList
              innerRef={droppableProvided.innerRef}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...droppableProvided.droppableProps}
              isDraggingOver={droppableSnapshot.isDraggingOver}
            >
              {list.map(({ current, name, duration }, i) => (
                <Draggable draggableId={name} index={i} key={name}>
                  {(draggableProvided, draggableSnapshot) => (
                    <StyledListItem
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...draggableProvided.draggableProps}
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...draggableProvided.dragHandleProps}
                      innerRef={draggableProvided.innerRef}
                      isDragging={draggableSnapshot.isDragging}
                    >
                      <ListItemText primary={current ? `✓ ${name}` : name} />
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
      name: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
  setAudioData: PropTypes.func.isRequired,
};
