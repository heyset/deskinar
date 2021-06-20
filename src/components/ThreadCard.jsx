import React from 'react';
import ThreadSub from './ThreadSub';

export default function ThreadCard({ op, id }) {
  return (
    <ThreadSub
      details={ op }
      replies={ [{author: 'bah', message: 'sein'}] }
    />
  )
}
