import React from 'react';
import axios from 'axios';

const baseURL = "https://api.quotable.io/random";

function Quote() {
    const [content, setContent] = React.useState(null);
    const [error, setError] = React.useState(null);
  
    React.useEffect(() => {
      // invalid url will trigger an 404 error
      axios.get(`${baseURL}`).then((response) => {
        setContent(response.data);
      }).catch(error => {
        setError(error);
      });
    }, []);
    
    if (error) return `Error: ${error.message}`;
    if (!content) return "No quote!"
  
    return (
      <div>
        <p>{content.content}</p>
      </div>
    );
  }

  
  export {Quote}