import Toggle from '../components/Toggle.tsx';
import { useChanges } from '../hooks/Changes.ts';
import { useContext } from '../hooks/Context.ts';

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
    <input />
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tincidunt risus nec dapibus ultrices. Nulla eget auctor enim. Praesent ac nisl sit amet ligula tempus aliquam. Maecenas id euismod urna. Nulla mattis rutrum nibh, a molestie leo tempor et. Phasellus volutpat velit quis consectetur ultrices. Aenean nec nisl et urna molestie lacinia id eu nisl. Quisque vel sollicitudin mi, quis pretium enim. Aenean tempor est vitae facilisis dictum. Ut non turpis vel leo porta sodales eget in mauris. Praesent vehicula in odio at fringilla.<br /><br /><br />
    Nunc sagittis neque purus, at tincidunt diam pretium in. Quisque ac tempor elit, nec laoreet mi. Fusce at iaculis enim. Praesent eget velit eget dui vestibulum euismod nec quis elit. Pellentesque fermentum scelerisque ante vel sollicitudin. Quisque eu vulputate sem, vestibulum malesuada urna. Quisque malesuada ac ex vitae convallis.
  </section>)
}
