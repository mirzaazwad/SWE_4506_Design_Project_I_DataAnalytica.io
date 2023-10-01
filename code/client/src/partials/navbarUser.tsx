import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { cloudUpload } from "ionicons/icons";
import "../assets/css/navbar.css";
import React,{ useState, useEffect } from "react";

const NavbarUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const allowedFormats = [
    "text/csv",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/json",
  ];

  const handleLogout = () => {
    return navigate("/");
  };

  const handleUploadClick = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const type = file.type;
      if (allowedFormats.includes(type)) {
        setSelectedFile(file.name);
        setErrorMsg("");
      } else {
        setErrorMsg("Invalid file format");
        setSelectedFile(null);
      }
    }
  };
  useEffect(() => {
    if (errorMsg === '' && selectedFile!= null) {
      console.log('Selected file:', selectedFile);
    }
    else if(errorMsg!='' && errorMsg != null) 
    {
      console.log('Error message:', errorMsg);
    }
  }, [selectedFile, errorMsg]);

  return (
    <Navbar className="customNavbar fixed-top " variant="dark" expand="lg">
      <Container
        fluid
        className="navbarContents px-0 px-lg-5 d-flex justify-content-between"
      >
        <Navbar.Brand className="px-2">
          <Link to="/profile" className="px-2 navbar-brand">
            DataAnalytica.io
          </Link>
        </Navbar.Brand>
        <Button className="mobileIcons bg-transparent me-3">
          <IonIcon icon={cloudUpload}>Upload Dataset</IonIcon>
        </Button>
        <Navbar.Toggle className="px-2" aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0 px-2"
            style={{ maxHeight: "150px" }}
            navbarScroll
          >
            <Nav.Link
              as={Link}
              to="/profile"
              active={location.pathname === "/profile"}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/data"
              active={location.pathname === "/data"}
            >
              Data
            </Nav.Link>
            <Nav.Link className="d-block d-lg-none c" onClick={handleLogout}>
              Log Out
            </Nav.Link>
          </Nav>
          <div>
            <Button
              className="customCart bg-transparent me-3"
              onClick={handleUploadClick}
            >
              <IonIcon icon={cloudUpload}>Upload Dataset</IonIcon>
            </Button>
            {/* File Input (Hidden) */}
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileInputChange}
            />
          </div>
          <div className="customLogOut d-none d-lg-flex justify-content-end">
            <Button className="btn customButton" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarUser;