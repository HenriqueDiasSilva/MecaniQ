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
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link href={'/home'} className='text-decoration-none'>
            <span className='text-white'>MECANIQ</span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-2 ms-lg-2 gap-lg-4">
            <Link className="text-decoration-none link-light" href="/pecas">Peças</Link>
            <Link className="text-decoration-none link-light" href="/veiculos">Veículos</Link>
            <Link className="text-decoration-none link-light" href="/os">Ordem de Serviço</Link>
            <Link className="text-decoration-none link-light" href="/relatorios">Relatórios</Link>
          </Nav>
          <div className="d-flex justify-content-start justify-content-lg-end mt-2 mt-lg-0">
            <PersonCircle size={22} className='link-light' />
            <NavDropdown className="link-light ms-2" title={name} id="basic-nav-dropdown">
              <Link className="dropdown-item link-light" href="/profile">Perfil</Link>
              <div className="dropdown-item link-light link" onClick={handleExit}>Sair</div>
            </NavDropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
}

export default NavbarComponent;