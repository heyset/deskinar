import React from 'react';
import relativeTime from 'dayjs/plugin/relativeTime';
import locale_br from 'dayjs/locale/pt-br';
import Dayjs from 'dayjs';
Dayjs.extend(relativeTime);
Dayjs.locale(locale_br);

export default function ThreadSub({ details, id, replies }) {
  const { author, timestamp, message } = details;
  const age = new Dayjs(timestamp).fromNow();

  return (
    <li>
      <p>{author}</p>
      <p>{age}</p>
      <p>{message}</p>

      { replies
        ? <ol>
            {replies.map((reply) => <ThreadSub details={reply} />)}
          </ol>
        : null
      }
    </li>
  )
}
