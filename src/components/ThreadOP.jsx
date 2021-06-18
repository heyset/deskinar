import React from 'react';

export default function ThreadOP({ details, id, children }) {
  const { author, timestamp, message } = details;

  return (
    <li>
      <p>{ author }</p>
      <p>{ timestamp }</p>
      <p>{ message }</p>

      <ol>
        { children }
      </ol>
    </li>
  )
}
