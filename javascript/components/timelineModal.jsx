import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function generate_date_html(name, date, color) {
  const dateString = date ? new Date(date).toLocaleDateString() : "Unknown"
  return (
    <tr>
      <td><strong style={{color}}>{name}:</strong>&emsp;</td> <td>{dateString}</td>
    </tr>
  )
}

// adapted from https://react-bootstrap.netlify.app/docs/components/modal/#live-demo
function TimelineModal({ timelineDates }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        View Timeline
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Dates</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <table>
            <tbody>
              {generate_date_html("Date Modified", timelineDates.dateModified, "black")}
              {generate_date_html("Date Created", timelineDates.dateCreated, "purple")}
              {generate_date_html("Date Effective", timelineDates.dateEffective, "blue")}
              {generate_date_html("Date Closed", timelineDates.dateClosed, "red")}
              {generate_date_html("Date Comments Opened", timelineDates.dateCommentsOpened, "green")}
            </tbody>
          </table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TimelineModal;