import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

function CommentList({ comments }) {
  return (
    <div>
{comments.length > 0 ? (
  <>
    <h5>Hidden Comments</h5>
    <Accordion defaultActiveKey="0" flush>
      {comments.map((comment) => (        
        <Accordion.Item eventKey={comment.id}>
          <Accordion.Header>{ comment.title.substring(0, 10) }</Accordion.Header>
          <Accordion.Body>
            { comment.title }
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  </>
) : (
  <>
    <h5>No Hidden Comments ☹️</h5>
  </>
)}
 
    </div>
  );
}

export default CommentList;
