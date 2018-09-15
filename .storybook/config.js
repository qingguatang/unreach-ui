import React from 'react';
import { configure, storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import '../examples/style.scss';

const rName = /^\.\/([-\w]+)/;

const req = require.context('../examples', true, /^\.\/(([-\w]+\/index\.js)|([-\w]+\.js))$/);

const stories = [];
req.keys().forEach(name => {
  const mod = req(name);
  let Apps = mod.App || mod.Apps || mod.default;
  if (Apps) {
    const Title = Apps.Title || Apps.title || (rName.exec(name)[1]);
    Apps = Array.isArray(Apps) ? Apps : [Apps];
    stories.push({ Title, Apps });
  }
});


function loadStories() {
  stories.forEach(story => {
    const s = storiesOf(story.Title, module);
    story.Apps.forEach(App => {
      const title = App.displayName || App.name || 'default';
      s.add(title, () => (
        <App action={action('action')} createAction={action} />
      ));
    });
  });
}


configure(loadStories, module);
