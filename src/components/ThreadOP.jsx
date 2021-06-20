import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import Dayjs from 'dayjs';
Dayjs.extend(relativeTime);

export default function ThreadOP({ details, id, children }) {
  const { author, timestamp, message } = details;
  const age = new Dayjs(timestamp).fromNow();

  return (
    <li>
      <p>{ author }</p>
      <p>{ age }</p>
      <p>{ message }</p>

      <ol>
        { children }
      </ol>
    </li>
  )
}
