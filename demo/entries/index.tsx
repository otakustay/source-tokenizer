import {render} from 'react-dom';
import App from '../components/App';
import './index.global.less';

render(
    <App />,
    document.body.appendChild(document.createElement('div'))
);
