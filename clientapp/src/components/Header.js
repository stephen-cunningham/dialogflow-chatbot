import React from "react";
import {Link} from 'react-router-dom';
import {Nav} from 'react-bootstrap';

const Header = () => (
    <div>
        <Nav variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                    <Nav.Link href="/">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1" href={"/about"}>About</Nav.Link>
                </Nav.Item>
        </Nav>
    </div>
);

export default Header;