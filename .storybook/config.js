import React from 'react';
import { configure, storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '../stories/style.scss';

const rName = /^\.\/([-\w]+)/;

const req = require.context('../stories', true, /^\.\/(([-\w]+\/index\.js)|([-\w]+\.js))$/);

const stories = [];
req.keys().forEach(name => {
  const mod = req(name);
  let Apps = mod.App || mod.Apps || mod.default;
  if (Apps) {
    const title = mod.Title || mod.title || (rName.exec(name)[1]);
    const sort = mod.sort || 1;
    Apps = Array.isArray(Apps) ? Apps : [Apps];
    stories.push({ title, Apps, sort });
  }
});

stories.sort((left, right) => {
  return left.sort > right.sort ? 1 : -1;
});


function loadStories() {
  stories.forEach(story => {
    const s = storiesOf(story.title, module);
    story.Apps.forEach(App => {
      const title = App.displayName || App.name || 'default';
      s.add(title, () => (
        <App action={action('action')} createAction={action} />
      ));
    });
  });
}


configure(loadStories, module);
