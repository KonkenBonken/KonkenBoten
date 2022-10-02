import React from 'react';
import { useContext } from '../hooks/Context.ts';
import { useChanges } from '../hooks/Changes.ts';
import Toggle from '../components/Toggle.tsx';
import { RoleSelect } from '../components/RoleSelect.ts';

export default function SupportChannelSettings() {
  const [{ guild: { database: { Tickets } } }] = useContext(),
    [, addChange] = useChanges();

  console.log(Tickets);

  return (<section>
    <button onClick={() => {
      console.log('Clicked');
      addChange({ testChange: true })
    }}>Add Change</button>
    <Toggle toggled={Tickets.enabled} />
    <RoleSelect />
    <input />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt risus nec dapibus ultrices. Nulla eget auctor enim. Praesent ac nisl sit amet ligula tempus aliquam. Maecenas id euismod urna. Nulla mattis rutrum nibh, a molestie leo tempor et. Phasellus volutpat velit quis consectetur ultrices. Aenean nec nisl et urna molestie lacinia id eu nisl. Quisque vel sollicitudin mi, quis pretium enim. Aenean tempor est vitae facilisis dictum. Ut non turpis vel leo porta sodales eget in mauris. Praesent vehicula in odio at fringilla.<br /><br /><br />
    Nunc sagittis neque purus, at tincidunt diam pretium in. Quisque ac tempor elit, nec laoreet mi. Fusce at iaculis enim. Praesent eget velit eget dui vestibulum euismod nec quis elit. Pellentesque fermentum scelerisque ante vel sollicitudin. Quisque eu vulputate sem, vestibulum malesuada urna. Quisque malesuada ac ex vitae convallis.
  </section>)
}


/* const dataExample = {
"enabled": true,
"messages": {
  "start": {
    "content": "**Välkommen till din ticket!**\nVänligen skriv ditt ärende nedan så återkommer vi så snabbt vi kan!",
    "footer": "Klicka på ❌ för att avsluta din ticket."
  },
  "end": "Du är påväg att avsluta din ticket. Är du helt säker på att du vill göra det?\nJa, jag vill avsluta: ✅\nNej, jag vill inte stänga än: ❌",
  "save": "**Medlemmen har avslutat ticketen och kan nu inte se denna kanal längre.**\nSpara ticket: ✅\nRadera ticket: ❌"
},
"staff": "796790705417617469",
"channel": "800857766092603443",
"parent": "786683651643539466",
"name": "┊🎫・{u}",
"content": "Här kan du öppna en kanal med endast personalen från servern.\nDetta kan du göra om du vill **anmäla en person**, **hittat ett fel**, **har en fråga eller något annat**.\nKlicka på 📩 för att öppna ett ärende.",
"emoji": "📩",
"color": "#2ce407",
"existingMessage": "866404933654020096",
"ticketsCreated": [],
"transcripts": [{}],
"save": "always",
"claim": 1
} */
