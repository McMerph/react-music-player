import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import styled from 'styled-components';

const Input = styled.input`
  display: none;
`;

const AddFiles = ({ addFiles }) => {
  const onChange = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      addFiles(target.files);
    }
  };

  return (
    <div>
      <Input
        id="files-chooser"
        type="file"
        accept=".mp3,.flac,.ogg,.wav"
        multiple
        onChange={onChange}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="files-chooser">
        <IconButton aria-label="add file(s)" component="span">
          <AddCircleOutlineIcon />
        </IconButton>
      </label>
    </div>
  );
};

AddFiles.propTypes = { addFiles: PropTypes.func.isRequired };

export default AddFiles;
