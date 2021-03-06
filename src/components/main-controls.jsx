import React from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import styled from 'styled-components';
import ActionType from '../store/action-type';
import LoopInput from './loop-input';

const Wrapper = styled.div`
  display: flex;
  align-items: baseline;
  margin-top: 12px;
`;
const FileInput = styled.input`
  display: none;
`;
const StyledLoopInput = styled(LoopInput)`
  width: 96px;
`;

const MainControls = ({ addFiles, setAudioData }) => {
  const defaultLoop = useSelector((state) => state.defaultLoop);
  const dispatch = useDispatch();

  const saveDefaultLoop = (loop) => {
    dispatch({ type: ActionType.SetDefaultLoop, loop });
  };
  const onChange = async (event) => {
    const target = event.currentTarget;
    if (target.files && target.files[0]) {
      addFiles(target.files);
    }
  };

  return (
    <Wrapper>
      {/* https://material-ui.com/components/buttons/#upload-button */}
      <FileInput
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

      <StyledLoopInput
        label="Default loop"
        loopNumber={defaultLoop}
        setLoopNumber={saveDefaultLoop}
      />
      <IconButton
        aria-label="reset track loops to default value"
        color="primary"
        onClick={() => {
          setAudioData((prev) => ({
            ...prev,
            list: prev.list.map((v) => ({ ...v, loop: defaultLoop })),
          }));
        }}
      >
        <RotateLeftIcon />
      </IconButton>
    </Wrapper>
  );
};

MainControls.propTypes = {
  addFiles: PropTypes.func.isRequired,
  setAudioData: PropTypes.func.isRequired,
};

export default MainControls;
