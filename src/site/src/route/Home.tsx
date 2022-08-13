import { BackgroundImage } from '../components/BackgroundImage.tsx';
import { Loading } from '../components/Loading.tsx';

import '../styles/routes/home.scss';

export default function Home() {
  return (<>
    <BackgroundImage />
    <Loading />
  </>);
}
