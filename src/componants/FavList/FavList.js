import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import axios from "axios";




function FavList() {


    const [favArr, setfavArr] = useState([]);
    const sendReq = async () => {
        const serverURL = `https://movies-library-production-fb71.up.railway.app/get_movies`;
        const response = await fetch(serverURL);
        const data = await response.json();
        console.log(data);
        setfavArr(data);


    }

    useEffect(() => {
        sendReq()
    }, [])

    const [clickedMovie , setClickedMovie] = useState({})
    const [showFlag, setShowFlag] = useState(false)
    const handleShow = (item) => {
        setShowFlag(true);
        setClickedMovie(item);
    }


    const handleclose = () => {
        setShowFlag(false);
    }

    const handleSubmit = async (e) => {
          e.preventDefault();
          const url = `https://movies-library-production-fb71.up.railway.app/update_movie/${clickedMovie.id}`;
          const body = {
            comment: e.target.comment.value
          };
          const axiosData = await axios.put(url,body);
          const newFavList = axiosData.data;
          setfavArr(newFavList);
          setShowFlag(false);
    };
    
    const handleDelete = async () => {
        const url = `https://movies-library-production-fb71.up.railway.app/delete_movie/${clickedMovie.id}`;
        const axiosData = await axios.delete(url);
        const newFavList = axiosData.data;
        setfavArr(newFavList);
    };



    return (
        <>
            <Row xs={1} md={4} className="g-4">
                {favArr.map((item) => {
                    return <Col>
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`} />
                            <Card.Body>
                                <Card.Title>{item.title}</Card.Title>
                                <Card.Text>
                                    <p>{item.overview}</p>
                                </Card.Text>
                                <Card.Text>
                                    <p>{item.comment}</p>
                                </Card.Text>
                                <Button variant="success" onClick={() => {handleShow(item)}}>Update</Button>{' '}
                                <Button variant="danger" onClick={()=>{
                                            setClickedMovie(item);
                                            handleDelete();
                                }}>Delete</Button>{' '}
                            </Card.Body>
                        </Card>
                    </Col>
                })}
            </Row>


            <Modal show={showFlag} onHide={handleclose}>
                <Modal.Header closeButton>
                    <Modal.Title>{clickedMovie.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Image src={`https://image.tmdb.org/t/p/w500/${clickedMovie.poster_path}`} width='100%'></Image>
                    <p>{clickedMovie.overview}</p>
                    <div>
                        <Form onSubmit={handleSubmit}>       
                            <Form.Control as="textarea" name="comment" defaultValue={clickedMovie.comment} />
                            <Button variant="primary" type="submit">
                        Save Changes
                        </Button>
                        </Form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleclose}>
                        Close
                    </Button>
                    
                </Modal.Footer>
            </Modal>

        </>


    )
}

export default FavList;