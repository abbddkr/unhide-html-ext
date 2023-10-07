import React from 'react';
import Accordion from 'react-bootstrap/Accordion';

function ParametersList({ parameterKeys }) {

  const totalWordCount = parameterKeys.reduce((count, col) => {
    return count + col.words.split(' ').length; 
  }, 0);

  return (
    <div>
      {parameterKeys.length > 0 ? (
        <>
        <small style={{fontStyle:'italic'}}>{totalWordCount} Results Found</small>
        <h5> Parameter List 👊</h5>
          <Accordion defaultActiveKey="0" flush>
            {parameterKeys.map((parameterKey) => {
            if (parameterKey.words) {
                return (
                  <Accordion.Item eventKey={parameterKey.id} key={parameterKey.id}>
                    <Accordion.Header>{parameterKey.source}</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-unstyled text-black"><li><code>{parameterKey.words}</code></li></ul>
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
          <h5>Parameters? Hmmm.. 🤔</h5> 
        </>
      )}
    </div>
  );
}

export default ParametersList;
