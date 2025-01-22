'use client';


import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { PersonCircle } from 'react-bootstrap-icons';
import { NavDropdown } from 'react-bootstrap';

interface NavbarComponentProps {
  name: string;
}

function NavbarComponent({ name }: NavbarComponentProps) {
  const router = useRouter();

  async function handleExit() {
    localStorage.removeItem("usuario");
    router.replace('/');
  }

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand>
          <Link href={'/home'} className='text-decoration-none link-default'>
            <span className='text-dark'>MECANIQ</span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link className="text-decoration-none link-secondary" href="/register">Cadastro</Link>
          </Nav>
          <div className="d-flex justify-content-start justify-content-lg-end mt-2 mt-lg-0">
            <PersonCircle size={22} className='link-secondary' />
            <NavDropdown className="link-secondary ms-2" title={name} id="basic-nav-dropdown">
              <Link className="dropdown-item link-secondary" href="/profile">Perfil</Link>
              <div className="dropdown-item link-secondary link" onClick={handleExit}>Sair</div>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default NavbarComponent;