import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

function StaticFileList({ files }) {
  
  const totalFileCount = files.reduce((count, col) => {
    return count + col.files.split(',').length;
  }, 0);

  return (
    <div>
      {files.length > 0 ? (
        <>
        <small style={{fontStyle:'italic'}}>{totalFileCount} Results Found</small>
        <h5>Detected Files 👊</h5>
          <Accordion defaultActiveKey="0" flush>
            {files.map((file) => {
            if (file.files) {
                return (
                  <Accordion.Item eventKey={file.id} key={file.id}>
                    <Accordion.Header>{file.source}</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-unstyled text-black"><li><code>{file.files}</code></li></ul>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              } else {
                return null;
              }
            })}
          </Accordion>
        </>
      ) : (
        <>
            <h5>There might be no files 🗂️</h5>
        </>
      )}
    </div>
  );
}

export default StaticFileList;
