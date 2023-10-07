import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Badge from 'react-bootstrap/Badge';

function APIKeysList({ apiKeys }) {
  
  const totalAPIKeysCount = apiKeys.reduce((count, col) => {
    return count + col.APIKeys.split(',').length;
  }, 0);

  return (
    <div>
      {apiKeys.length > 0 ? (
        <>
        <small style={{fontStyle:'italic'}}>{totalAPIKeysCount} Results Found</small>
        <h5>Available Keys 👊</h5>
          <Accordion defaultActiveKey="0" flush>
            {apiKeys.map((apiKey) => {
            if (apiKey.APIKeys) {
                return (
                  <Accordion.Item eventKey={apiKey.id} key={apiKey.id}>
                    <Accordion.Header>{apiKey.source}</Accordion.Header>
                    <Accordion.Body>
                      <ul className="list-unstyled text-black"><li><code>{apiKey.APIKeys}</code></li></ul>
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
            <h5>Looking for API Keys? Maybe there's not 😏</h5>
        </>
      )}
    </div>
  );
}

export default APIKeysList;
