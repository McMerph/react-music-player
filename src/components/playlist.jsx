import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const Wrapper = styled.div`
  background-color: ${(props) => props.backgroundColor};
  width: 100%;
  max-width: 360px;
`;

export default function Playlist({ data }) {
  const theme = useTheme();

  return (
    <Wrapper backgroundColor={theme.palette.background.paper}>
      <List>
        {data.map(({ name, duration }, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <ListItem key={i}>
            <ListItemText primary={name} />
            <Typography variant="subtitle2">{duration}</Typography>
          </ListItem>
        ))}
      </List>
    </Wrapper>
  );
}

Playlist.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      duration: PropTypes.string.isRequired,
    }).isRequired
  ).isRequired,
};
