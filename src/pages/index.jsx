import { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Pusher from 'pusher-js';

export default function Home() {
  const [ newThreadInput, setNewThreadInput ] = useState('');
  const [ threadHistory, setThreadHistory ] = useState([]);
  
  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe('deskinar');

    channel.bind('new-thread', (thread) => {
      setThreadHistory((previous) => {
        const newHistory = [...previous];
        newHistory.push(thread);
        return newHistory;
      })
    });

    fetch('/thread-history')
      .then((res) => res.json())
      .then((history) => setThreadHistory(history))
    .catch((err) => console.error(err));

    return () => pusher.disconnect();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setNewThreadInput('');

    const thread = {
      op: {
        author: 'fulano',
        message: newThreadInput,
      },
      replies: [],
    }

    const init = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thread),
    };

    fetch('/new-thread', init);
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newThreadInput}
          onChange={(e) => setNewThreadInput(e.target.value)}
        />
        <button type="submit">Perguntar</button>
      </form>

      <ol>
        { threadHistory.map(({ id, op }) => 
        <li key={ id }>
          <p>{ op.message }</p>
          <p>{ op.author }</p>
        </li>) }
      </ol>
    </main>
  );
}
