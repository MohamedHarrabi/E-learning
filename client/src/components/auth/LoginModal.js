import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  NavLink,
  Alert,
} from 'reactstrap';
import { getAuthUser, loginUser } from '../../redux/actions/userActions';

const LoginModal = () => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const toggle = () => {
    setModal(!modal);
  };

  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
    history.push('/dashboard');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <NavLink
        style={{ color: '#556272', fontWeight: 'bold' }}
        onClick={toggle}
        href='#'
      >
        Login
      </NavLink>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>login</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label for='email'>Email</Label>
              <Input
                required
                type='email'
                value={email}
                name='email'
                id='email'
                placeholder='email'
                className='mb-3'
                onChange={(e) => setEmail(e.target.value)}
              />
              <Label for='password'>Password</Label>
              <Input
                type='password'
                value={password}
                name='password'
                id='password'
                placeholder='Password'
                className='mb-3'
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color='primary' onClick={handleLogin}>
                Login
              </Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default LoginModal;
