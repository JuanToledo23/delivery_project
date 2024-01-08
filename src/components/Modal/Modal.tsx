import { FC } from 'react';
import './Modal.css';
import { Dialog, DialogProps, DialogActions, DialogContent, Button } from '@mui/material';

interface Props extends DialogProps {
  actions?: any;
  children?: any;
  onCancel?: any;
  onSave?: any;
  buttonSave?: string;
  buttonCancel?: string;
  disableNextButton?: boolean;
}

const Modal: FC<Props> = (props) => {
  const {
    onSave,
    onCancel,
    children,
    open,
    buttonSave = 'GUARDAR',
    buttonCancel = 'CANCELAR',
    disableNextButton
  } = props;

  return (
    <Dialog
      keepMounted
      fullWidth={true}
      {...props}
    >
      {open && (
        <DialogContent>
          <div className='Modal' data-testid="Modal">
            {children}
          </div>
        </DialogContent>
      )}
      <hr />
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>{buttonCancel}</Button>
        <Button variant="contained" onClick={onSave} disabled={disableNextButton}>{buttonSave}</Button>
      </DialogActions>
    </Dialog>
  );
}

export default Modal;
