/* eslint-disable react/prop-types */
import { Card } from "react-bootstrap";
import "../assets/CSS/FormAuth.css";

export default function FormAuth (props) {
    let { children, title = "judul", subTitle = "Sub Judul"} = props;
    return (
        <Card id="card__form__auth" className="shadow-sm">
            <Card.Body className="body__form">
                <Card.Title className=" text-center text-dark text-h3 title__form">
                    {title}
                </Card.Title>
                <Card.Subtitle className="text-p4 text-dark subtitle__form">
                    {subTitle}
                </Card.Subtitle>


                {children}
            </Card.Body>
        </Card>
    )
}